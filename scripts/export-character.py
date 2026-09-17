r"""
Bake the character .blend into the web GLB at public/models/character.glb.

    "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" -b public/mycharactor_rabbit_theme_v2.blend ^
        --python scripts/export-character.py -- public/models/character.glb [preview_dir]

What it does (the .blend itself is never modified):
- drops hidden construction refs, cameras, lights, floor
- curves -> meshes at a web-friendly resolution, modifiers applied, subsurf capped at 2
- the procedural sock shader (coloured by world Z) -> real geometry split into 3 flat materials
- flat-colour image textures (hoodie/shorts) -> plain base colour
- T-pose arms bent down into a relaxed A-pose (there's no rig in the file)
- joined into two nodes, Body + Head; the head's origin sits at the neck so the site can turn it
- Draco-compressed; the decoder is served locally from public/draco/

Pass a preview_dir to also get two quick EEVEE renders of the baked pose.
"""
import bpy, bmesh, math, sys, os
from mathutils import Vector, Matrix

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = argv[0]
PREVIEW = argv[1] if len(argv) > 1 and argv[1] != "-" else None
ARM_DEG = float(argv[2]) if len(argv) > 2 else 62.0
PIVOT_X = float(argv[3]) if len(argv) > 3 else 0.56
PIVOT_Z = float(argv[4]) if len(argv) > 4 else -1.12
W0 = float(argv[5]) if len(argv) > 5 else 0.46
W1 = float(argv[6]) if len(argv) > 6 else 1.0

scene = bpy.context.scene

# ---------- 1. choose what ships ----------
keep = [o for o in scene.objects
        if o.type in ("MESH", "CURVE") and not o.hide_render and o.name != "Studio floor"]

# curve resolution: plenty at 1-2 px on screen
for o in keep:
    if o.type == "CURVE":
        d = o.data
        heavy = any(k in o.name for k in ("rim", "Hood", "hem", "stitch", "seam"))
        d.resolution_u = 4 if heavy else 6
        for s in d.splines:
            s.resolution_u = d.resolution_u
        thin = any(k in o.name for k in ("Glasses", "lace", "stitch", "seam"))
        d.bevel_resolution = 1 if thin else 2

# subsurf: cap levels so the silhouette stays smooth without 300k tris
for o in keep:
    for m in o.modifiers:
        if m.type == "SUBSURF":
            m.levels = min(m.levels, 2)

dg = bpy.context.evaluated_depsgraph_get()
dg.update()

# ---------- 2. evaluate everything into plain world-space meshes ----------
baked = []
for o in keep:
    ev = o.evaluated_get(dg)
    me = bpy.data.meshes.new_from_object(ev, preserve_all_data_layers=True, depsgraph=dg)
    if len(me.vertices) == 0:
        continue
    me.transform(o.matrix_world)
    if o.matrix_world.determinant() < 0:
        me.flip_normals()
    nob = bpy.data.objects.new(o.name + "#", me)
    scene.collection.objects.link(nob)
    baked.append(nob)

for o in list(scene.objects):
    if o not in baked:
        bpy.data.objects.remove(o, do_unlink=True)
for o in baked:
    o.name = o.name[:-1]


def by(name):
    return bpy.data.objects[name]


# ---------- decimation helper ----------
def decimate(obj, ratio):
    md = obj.modifiers.new("dec", "DECIMATE")
    md.ratio = ratio
    d = bpy.context.evaluated_depsgraph_get()
    d.update()
    ev = obj.evaluated_get(d)
    me = bpy.data.meshes.new_from_object(ev, preserve_all_data_layers=True, depsgraph=d)
    old = obj.data
    obj.modifiers.clear()
    obj.data = me
    bpy.data.meshes.remove(old)



# ---------- 3. materials ----------
def flat_mat(name, rgb, rough=0.8, metal=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    p = nt.nodes.new("ShaderNodeBsdfPrincipled")
    p.inputs["Base Color"].default_value = (*rgb, 1.0)
    p.inputs["Roughness"].default_value = rough
    p.inputs["Metallic"].default_value = metal
    nt.links.new(p.outputs["BSDF"], out.inputs["Surface"])
    return m


M_SKIN = flat_mat("Skin", (1.0, 0.745, 0.591), 0.62)
M_SOCK = flat_mat("Sock", (0.855, 0.823, 0.738), 0.83)
M_STRIPE = flat_mat("Sock stripe", (0.73, 0.165, 0.038), 0.83)
M_HOODIE = flat_mat("Hoodie", (0.956, 0.13, 0.026), 0.86)
M_SHORTS = flat_mat("Shorts", (0.034, 0.044, 0.044), 0.86)

swap = {
    "Hoodie | rabbit companion orange cotton": M_HOODIE,
    "Shorts | charcoal twill": M_SHORTS,
}
for o in baked:
    for i, slot in enumerate(o.data.materials):
        if slot and slot.name in swap:
            o.data.materials[i] = swap[slot.name]

# body: the sock shader coloured by world Z -> turn that into real geometry
# (decimate first: collapsing edges after the split would chew up the stripes)
body = by("Body | original base")
decimate(body, 0.5)
bm = bmesh.new()
bm.from_mesh(body.data)
for z in (-2.78, -2.835, -2.88, -2.96, -3.005):
    geom = bm.verts[:] + bm.edges[:] + bm.faces[:]
    bmesh.ops.bisect_plane(bm, geom=geom, plane_co=(0, 0, z), plane_no=(0, 0, 1))
bm.to_mesh(body.data)
bm.free()
body.data.materials.clear()
for m in (M_SKIN, M_SOCK, M_STRIPE):
    body.data.materials.append(m)
for f in body.data.polygons:
    cz = f.center.z
    if cz >= -2.78:
        f.material_index = 0
    elif (-2.88 < cz < -2.835) or (-3.005 < cz < -2.96):
        f.material_index = 2
    else:
        f.material_index = 1


# ---------- 4. T-pose -> relaxed A-pose ----------
def smooth(e0, e1, x):
    t = max(0.0, min(1.0, (x - e0) / (e1 - e0)))
    return t * t * (3 - 2 * t)


ARM = math.radians(ARM_DEG)
arm_objs = [
    "Body | original base", "Hoodie | original tailored mesh",
    "Hoodie | ribbed wrist -1", "Hoodie | ribbed wrist 1",
    "Sleeve | blue stripe -1", "Sleeve | blue stripe 1",
]
for name in arm_objs:
    me = by(name).data
    for v in me.vertices:
        x, y, z = v.co
        if z < -1.95:
            continue
        w = smooth(W0, W1, abs(x))
        if w <= 0:
            continue
        a = ARM * w
        s = 1 if x > 0 else -1
        px = s * PIVOT_X
        dx, dz = x - px, z - PIVOT_Z
        ca, sa = math.cos(a), math.sin(a)
        nx = dx * ca + s * dz * sa
        nz = -s * dx * sa + dz * ca
        v.co = (px + nx, y, PIVOT_Z + nz)
    me.update()


for name, r in [("Face | peach and blush UV", 0.45)]:
    decimate(by(name), r)

# ---------- 6. smooth normals where it reads as soft vinyl ----------
for o in bpy.data.objects:
    if o.type != "MESH" or "pixel rabbit" in o.name:
        continue
    for p in o.data.polygons:
        p.use_smooth = True

# ---------- 7. group: Head (neck pivot) + Body ----------
HEAD_KEYS = ("Face |", "Glasses |", "Hair |", "Small smile")
FLOOR_Z = -3.85
NECK = Vector((0.0, 0.0, -0.62))


def join(objs, name):
    with bpy.context.temp_override(active_object=objs[0], object=objs[0],
                                   selected_objects=objs, selected_editable_objects=objs):
        bpy.ops.object.join()
    objs[0].name = name
    objs[0].data.name = name
    return objs[0]


meshes = [o for o in bpy.data.objects if o.type == "MESH"]
head_parts = [o for o in meshes if o.name.startswith(HEAD_KEYS)]
body_parts = [o for o in meshes if o not in head_parts]

head = join(head_parts, "Head")
body = join(body_parts, "Body")

body.data.transform(Matrix.Translation((0, 0, -FLOOR_Z)))
head.data.transform(Matrix.Translation(-NECK))

root = bpy.data.objects.new("Character", None)
scene.collection.objects.link(root)
body.parent = root
head.parent = root
head.location = (NECK.x, NECK.y, NECK.z - FLOOR_Z)

for o in (head, body):
    bm = bmesh.new()
    bm.from_mesh(o.data)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    bm.to_mesh(o.data)
    bm.free()
    print("OBJ", o.name, "verts", len(o.data.vertices),
          "tris", sum(len(p.vertices) - 2 for p in o.data.polygons),
          "mats", [m.name for m in o.data.materials])

tris = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in (head, body))
print("TOTAL TRIS", tris)

if PREVIEW:
    cam_data = bpy.data.cameras.new("c")
    cam = bpy.data.objects.new("c", cam_data)
    scene.collection.objects.link(cam)
    scene.camera = cam
    lights = []
    for lname, loc, e in [("k", (-4, -6, 9), 900), ("f", (5, -5, 5), 500), ("r", (2, 5, 7), 700)]:
        ld = bpy.data.lights.new(lname, "AREA")
        ld.energy = e
        ld.size = 5
        lo = bpy.data.objects.new(lname, ld)
        lo.location = loc
        scene.collection.objects.link(lo)
        lo.rotation_euler = (Vector((0, 0, 2.5)) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
        lights.append(lo)
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x, scene.render.resolution_y = 700, 900
    for tag, loc in [("front", (0, -11, 3.0)), ("tq", (6, -9.5, 4))]:
        cam.location = loc
        cam.rotation_euler = (Vector((0, 0, 2.75)) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
        scene.render.filepath = os.path.join(PREVIEW, f"pose_{tag}.png")
        bpy.ops.render.render(write_still=True)
    bpy.data.objects.remove(cam, do_unlink=True)
    for lo in lights:
        bpy.data.objects.remove(lo, do_unlink=True)

bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format="GLB",
    use_selection=False,
    export_apply=True,
    export_yup=True,
    export_animations=False,
    export_cameras=False,
    export_lights=False,
    export_extras=False,
    export_image_format="JPEG",
    export_jpeg_quality=88,
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=7,
    export_draco_position_quantization=14,
    export_draco_normal_quantization=10,
    export_draco_texcoord_quantization=12,
)
print("WROTE", OUT, os.path.getsize(OUT))
