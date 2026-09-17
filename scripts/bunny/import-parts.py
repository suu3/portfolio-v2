import bpy, json, os, sys
from mathutils import Vector
D = sys.argv[sys.argv.index("--") + 1]
for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
info = json.load(open(os.path.join(D, "info.json")))
def hexcol(h):
    h = h.lstrip("#"); c = [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)]
    return [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
for m in info:
    bpy.ops.wm.obj_import(filepath=os.path.join(D, m["name"] + ".obj"), forward_axis="NEGATIVE_Z", up_axis="Y")
    ob = bpy.context.selected_objects[0]
    ob.name = m["name"]
    mat = bpy.data.materials.new(m["name"]); mat.use_nodes = True
    mat.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (*hexcol(m["color"]), 1)
    mat.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.6
    ob.data.materials.clear(); ob.data.materials.append(mat)
    for p in ob.data.polygons: p.use_smooth = True
    bb = [ob.matrix_world @ Vector(c) for c in ob.bound_box]
    print("OBJ", ob.name, "z", round(min(v.z for v in bb), 2), round(max(v.z for v in bb), 2), "x", round(min(v.x for v in bb), 2), round(max(v.x for v in bb), 2), "y", round(min(v.y for v in bb), 2), round(max(v.y for v in bb), 2))
sc = bpy.context.scene
cam = bpy.data.objects.new("c", bpy.data.cameras.new("c")); sc.collection.objects.link(cam); sc.camera = cam
for n, loc, e in [("k", (-3, -5, 5), 600), ("f", (4, -3, 3), 300), ("r", (1, 4, 4), 400)]:
    ld = bpy.data.lights.new(n, "AREA"); ld.energy = e; ld.size = 4
    lo = bpy.data.objects.new(n, ld); lo.location = loc; sc.collection.objects.link(lo)
    lo.rotation_euler = (Vector((0, 0, 1.4)) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
sc.render.engine = "BLENDER_EEVEE"; sc.render.resolution_x, sc.render.resolution_y = 420, 520
for tag, loc in [("front", (0, -7.5, 1.6)), ("tq", (4.5, -5.8, 2.4)), ("side", (7.5, 0, 1.6))]:
    cam.location = loc
    cam.rotation_euler = (Vector((0, 0, 1.55)) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    sc.render.filepath = os.path.join(D, f"doll_{tag}.png")
    bpy.ops.render.render(write_still=True)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(D, "doll.blend"))
