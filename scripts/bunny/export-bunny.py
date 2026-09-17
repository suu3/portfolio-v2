"""
Bake public/models/bunny.glb from room-of-memory's rabbit-doll.glb (meshopt, no source .blend).

    node scripts/bunny/decode.mjs <room-of-memory>/public/assets/models/rabbit-doll.glb <work-dir>
    blender -b --factory-startup --python scripts/bunny/import-parts.py -- <work-dir>       # -> <work-dir>/doll.blend
    blender -b <work-dir>/doll.blend --python scripts/bunny/export-bunny.py -- public/models/bunny.glb <preview-dir|-> 58 0.12 0.08 tag

Args after the paths: arm angle (deg, + lowers the arms against the body), shoulder lift, inset, preview tag.
The doll's arms, legs and pads are separate mesh islands, so arms rotate rigidly about the shoulder.
Colours: white fur, apricot hoodie (torso + arms) with the hood down (cream lining, yellow cords), light pads,
lavender inner ears. HOOD=off env leaves the hood off.
"""
import bpy, bmesh, math, os, sys
from mathutils import Matrix, Vector

args = sys.argv[sys.argv.index("--") + 1:]
OUT, PREVIEW, ANGLE, LIFT, INSET, TAG = args[0], args[1], float(args[2]), float(args[3]), float(args[4]), args[5]

def islands(bm):
    bm.verts.ensure_lookup_table()
    seen, out = set(), []
    for v in bm.verts:
        if v.index in seen: continue
        stack, comp = [v], []
        seen.add(v.index)
        while stack:
            x = stack.pop(); comp.append(x)
            for e in x.link_edges:
                o = e.other_vert(x)
                if o.index not in seen:
                    seen.add(o.index); stack.append(o)
        out.append(comp)
    return out

def mat(name, hexrgb, rough=0.8):
    h = hexrgb.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    m = bpy.data.materials.new(name); m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = (*lin, 1); p.inputs["Roughness"].default_value = rough
    return m

# the orange rabbit: white fur, apricot hoodie (torso + arms), light paws/feet,
# lavender inner ears. A scarf/collar was tried and looked stuck on; the hood reads as clothing.
FUR = mat("Fur", "#f4f3ef")
# a softer apricot, not the character's hoodie orange — related, but not the same
HOODIE = mat("Hoodie", "#f4a57f", 0.86)
PAD = mat("Pad", "#e4e2ec")
EAR_IN = mat("Inner ear", "#cfc9f2")
FACE = mat("Face", "#27325a", 0.4)
SCARF = mat("Scarf", "#f9d169", 0.7)

def assign(ob, mats):
    ob.data.materials.clear()
    for m in mats:
        ob.data.materials.append(m)

for ob in [o for o in bpy.data.objects if o.type == "MESH"]:
    ob.data.transform(ob.matrix_world); ob.matrix_world = Matrix.Identity(4)
    bm = bmesh.new(); bm.from_mesh(ob.data)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-4)
    bm.faces.ensure_lookup_table()

    if ob.name in ("Cube", "Cube004"):
        for comp in islands(bm):
            xs = [v.co.x for v in comp]; zs = [v.co.z for v in comp]; ys = [v.co.y for v in comp]
            is_arm = max(abs(x) for x in xs) > 0.85 and min(zs) > 0.45 and min(ys) > -0.3
            is_leg = min(ys) < -0.7 and max(zs) < 0.65
            if is_arm:
                side = 1 if sum(xs) > 0 else -1
                pivot = Vector((side * 0.4, 0.19, 0.77))
                R = Matrix.Rotation(math.radians(ANGLE) * side, 4, "Y")
                T = Matrix.Translation(pivot + Vector((-side * INSET, 0, LIFT))) @ R @ Matrix.Translation(-pivot)
                for v in comp:
                    v.co = T @ v.co
            faces = {f for v in comp for f in v.link_faces}
            if ob.name == "Cube":
                idx = 0 if is_leg else 1          # legs white, torso + arms hoodie
            else:
                idx = 1 if (not is_arm and not is_leg) else 0  # belly spot → hoodie, paw/foot pads → pad
            for f in faces:
                f.material_index = idx
        assign(ob, [FUR, HOODIE] if ob.name == "Cube" else [PAD, HOODIE])

    elif ob.name == "Cube001":
        # the ear itself is all fur; the inner ear is a separate smooth ellipse
        # shrink-wrapped onto its front (painting faces gave a ragged outline)
        EAR_SPOTS = []
        for comp in islands(bm):
            xs = [v.co.x for v in comp]; ys = [v.co.y for v in comp]; zs = [v.co.z for v in comp]
            EAR_SPOTS.append(((min(xs) + max(xs)) / 2, min(ys), max(zs), max(xs) - min(xs)))
        for f in bm.faces:
            f.material_index = 0
        assign(ob, [FUR])
    elif ob.name in ("Roundcube", "Sphere"):
        for f in bm.faces: f.material_index = 0
        assign(ob, [FUR])
    elif ob.name == "Cube006":
        for f in bm.faces: f.material_index = 0
        assign(ob, [FACE])

    bm.to_mesh(ob.data); bm.free()

HOOD = os.environ.get("HOOD", "on") != "off"
LINING = mat("Hood lining", "#f3e2bd", 0.85)
HOOD_INNER = mat("Hood inside", "#e3906a", 0.9)
CORD = mat("Cord", "#f9d169", 0.7)

if HOOD:
    # hood down: a bowl draped behind the neck, opening toward the head.
    # Outer shell hoodie-coloured, the solidified inner face + cut rim in cream.
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.72, segments=56, ring_count=28, location=(0, 0.28, 0.95))
    hood = bpy.context.active_object
    hood.name = "Hood"
    # wide enough to drape over the shoulders so the arms sit inside it, not through it
    hood.scale = (1.04, 0.86, 0.64)
    with bpy.context.temp_override(active_object=hood, object=hood, selected_objects=[hood], selected_editable_objects=[hood]):
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bm = bmesh.new(); bm.from_mesh(hood.data)
    # keep the sides wrapping forward around the shoulders; open at the top
    # the front edge swings back toward the sides, so from the front the hood
    # tucks behind the shoulders instead of flaring out like wings
    cut = [v for v in bm.verts if v.co.y < -0.18 + 0.3 * (abs(v.co.x) / 0.75) ** 2 or v.co.z > 0.1]
    bmesh.ops.delete(bm, geom=cut, context="VERTS")
    bm.to_mesh(hood.data); bm.free()
    # outside hoodie, inside a shade darker, only the cut edge in cream — a
    # cream inside read as little wings behind the shoulders
    assign(hood, [HOODIE, HOOD_INNER, LINING])
    for p in hood.data.polygons:
        p.material_index = 0
        p.use_smooth = True
    sol = hood.modifiers.new("thick", "SOLIDIFY")
    sol.thickness = 0.07
    sol.offset = -1
    sol.material_offset = 1
    sol.material_offset_rim = 2
    sub = hood.modifiers.new("soft", "SUBSURF")
    sub.levels = 1
    dg = bpy.context.evaluated_depsgraph_get(); dg.update()
    baked = bpy.data.meshes.new_from_object(hood.evaluated_get(dg), preserve_all_data_layers=True, depsgraph=dg)
    old = hood.data; hood.modifiers.clear(); hood.data = baked; bpy.data.meshes.remove(old)
    hood.data.transform(hood.matrix_world); hood.matrix_world = Matrix.Identity(4)

    # neckline: the hood opening wraps the neck and tucks up under the chin, so
    # there's no bare strip between head and hoodie. Hoodie colour outside, a
    # thin cream lining ring peeking at the top edge.
    bpy.ops.mesh.primitive_torus_add(major_radius=0.36, minor_radius=0.13, major_segments=64, minor_segments=18,
                                     location=(0, 0.19, 0.98))
    neck = bpy.context.active_object; neck.name = "Neckline"; neck.scale = (1.0, 0.95, 0.85)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.33, minor_radius=0.05, major_segments=64, minor_segments=12,
                                     location=(0, 0.17, 1.075))
    lining = bpy.context.active_object; lining.name = "Neckline lining"
    for o in (neck, lining):
        with bpy.context.temp_override(active_object=o, object=o, selected_objects=[o], selected_editable_objects=[o]):
            bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
        for p in o.data.polygons:
            p.use_smooth = True
    assign(neck, [HOODIE])
    assign(lining, [LINING])

    # drawcords hanging down the chest from under the neckline, with little aglets
    parts = []
    for sx in (-1, 1):
        bpy.ops.mesh.primitive_cylinder_add(radius=0.026, depth=0.3, vertices=12, location=(sx * 0.11, -0.25, 0.76))
        c = bpy.context.active_object; c.rotation_euler = (math.radians(-12), 0, 0); parts.append(c)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.045, segments=14, ring_count=8, location=(sx * 0.11, -0.28, 0.6))
        parts.append(bpy.context.active_object)
    cords = parts[0]
    with bpy.context.temp_override(active_object=cords, object=cords, selected_objects=parts, selected_editable_objects=parts):
        bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
        bpy.ops.object.join()
    cords.name = "Cords"
    assign(cords, [CORD])
    for p in cords.data.polygons:
        p.use_smooth = True

# ears stay full-res so the inner-ear outline stays smooth
# inner-ear ellipses: concentric rings (smooth outline + inner verts to conform)
ear_obj = bpy.data.objects["Cube001"]
for i, (cx, front_y, top, width) in enumerate(EAR_SPOTS):
    bm = bmesh.new()
    rx, rz, cz = width * 0.24, 0.25, top - 0.53
    RINGS, SEG = 7, 56
    center = bm.verts.new((cx, front_y - 0.12, cz))
    rings = []
    for r in range(1, RINGS + 1):
        k = r / RINGS
        rings.append([bm.verts.new((cx + math.cos(a) * rx * k, front_y - 0.12, cz + math.sin(a) * rz * k))
                      for a in (2 * math.pi * j / SEG for j in range(SEG))])
    for j in range(SEG):
        bm.faces.new((center, rings[0][j], rings[0][(j + 1) % SEG]))
    for r in range(RINGS - 1):
        for j in range(SEG):
            bm.faces.new((rings[r][j], rings[r + 1][j], rings[r + 1][(j + 1) % SEG], rings[r][(j + 1) % SEG]))
    me = bpy.data.meshes.new(f"InnerEar{i}")
    bm.to_mesh(me); bm.free()
    spot = bpy.data.objects.new(f"InnerEar{i}", me)
    bpy.context.scene.collection.objects.link(spot)
    sw = spot.modifiers.new("wrap", "SHRINKWRAP")
    sw.target = ear_obj
    sw.wrap_method = "PROJECT"
    sw.use_project_y = True
    sw.use_negative_direction = True
    sw.use_positive_direction = True
    sw.offset = 0.006
    dg = bpy.context.evaluated_depsgraph_get(); dg.update()
    baked = bpy.data.meshes.new_from_object(spot.evaluated_get(dg), preserve_all_data_layers=True, depsgraph=dg)
    spot.modifiers.clear(); spot.data = baked
    # face the camera side (the rings were wound away from it)
    bm = bmesh.new(); bm.from_mesh(spot.data)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    for f in bm.faces:
        if f.normal.y > 0:
            f.normal_flip()
    bm.to_mesh(spot.data); bm.free()
    assign(spot, [EAR_IN])
    for p in spot.data.polygons: p.use_smooth = True

for name, r in (("Cube", 0.35), ("Roundcube", 0.4), ("Cube004", 0.5), ("Cube006", 0.6)):
    ob = bpy.data.objects[name]
    md = ob.modifiers.new("dec", "DECIMATE"); md.ratio = r
    dg = bpy.context.evaluated_depsgraph_get(); dg.update()
    new = bpy.data.meshes.new_from_object(ob.evaluated_get(dg), preserve_all_data_layers=True, depsgraph=dg)
    old = ob.data; ob.modifiers.clear(); ob.data = new; bpy.data.meshes.remove(old)
for ob in [o for o in bpy.data.objects if o.type == "MESH"]:
    for p in ob.data.polygons: p.use_smooth = True
print("VERTS", sum(len(o.data.vertices) for o in bpy.data.objects if o.type == "MESH"))

if PREVIEW != "-":
    sc = bpy.context.scene
    sc.render.engine = "BLENDER_EEVEE"; sc.render.resolution_x, sc.render.resolution_y = 360, 440
    cam = bpy.data.objects["c"]
    for tag, loc, aim in [("front", (0, -7.5, 1.6), 1.4), ("tq", (4.5, -5.8, 2.4), 1.4), ("neck", (1.6, -3.4, 1.35), 1.05), ("ears", (0.9, -3.2, 2.7), 2.6), ("chin", (0.0, -3.6, 1.2), 1.1), ("back", (-4.2, 5.2, 2.4), 1.2)]:
        cam.location = loc
        cam.rotation_euler = (Vector((0, 0, aim)) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
        sc.render.filepath = os.path.join(PREVIEW, f"rig_{TAG}_{tag}.png")
        bpy.ops.render.render(write_still=True)

if OUT != "-":
    for o in list(bpy.data.objects):
        if o.type != "MESH":
            bpy.data.objects.remove(o, do_unlink=True)
    names = {"Cube": "Body", "Cube001": "Ears", "Cube004": "Pads", "Cube006": "Face", "Roundcube": "Head", "Sphere": "Tail", "Hood": "Hood", "Cords": "Cords", "Neckline": "Neckline", "Neckline lining": "NecklineLining", "InnerEar0": "InnerEarL", "InnerEar1": "InnerEarR"}
    for o in bpy.data.objects:
        o.name = names.get(o.name, o.name)
    bpy.ops.export_scene.gltf(filepath=OUT, export_format="GLB", export_yup=True, export_apply=True,
        export_animations=False, export_cameras=False, export_lights=False,
        export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=7,
        export_draco_position_quantization=13, export_draco_normal_quantization=10)
    print("WROTE", OUT, os.path.getsize(OUT))
