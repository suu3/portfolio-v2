r"""
Bake the character .blend into the web GLB at public/models/character.glb.

    "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" -b public/mycharactor_rabbit_theme_v2.blend ^
        --python scripts/export-character.py -- public/models/character.glb [preview_dir]

What it does (the .blend itself is never modified):
- drops hidden construction refs, cameras, lights, floor, the glasses and the barrettes
- curves -> meshes at a web-friendly resolution, modifiers applied, subsurf capped at 2
- the procedural sock shader (coloured by world Z) -> real geometry split into 3 flat materials
- flat-colour image textures (hoodie/shorts) -> plain base colour; skin lightened
- rigs it: a 13-bone armature (incl. two eye bones for blinking) with hand-computed weights (the file has no rig), then
  keyframes the clips the site plays — Idle / Sit / Perch / Run / Wave / Recline — and pushes
  each onto an NLA track so the glTF exporter writes them as separate animations
- one skinned mesh "Character" under the "Armature" node, feet at y = 0
- Draco-compressed; the decoder is served locally from public/draco/

Pass a preview_dir to also get EEVEE renders of every clip, and optionally a comma
list of clip names after it to render only those.
"""
import bpy, bmesh, math, sys, os
import numpy as np
from mathutils import Vector, Matrix

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = argv[0]
PREVIEW = argv[1] if len(argv) > 1 and argv[1] != "-" else None
PREVIEW_ONLY = set(argv[2].split(",")) if len(argv) > 2 else None

scene = bpy.context.scene
FLOOR_Z = -3.85
FPS = 24
scene.render.fps = FPS

# ---------- 1. choose what ships ----------
DROP = ("Glasses |", "Hair | pastel barrette", "Studio floor")
keep = [o for o in scene.objects
        if o.type in ("MESH", "CURVE") and not o.hide_render and not o.name.startswith(DROP)]

# curve resolution: plenty at 1-2 px on screen
for o in keep:
    if o.type == "CURVE":
        d = o.data
        heavy = any(k in o.name for k in ("rim", "Hood", "hem", "stitch", "seam"))
        d.resolution_u = 4 if heavy else 6
        for s in d.splines:
            s.resolution_u = d.resolution_u
        thin = any(k in o.name for k in ("lace", "stitch", "seam"))
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


# skin: pull the painted face texture (with its blush) halfway to white and
# match the flat skin colour to its new base
SKIN_LIGHTEN = 0.5
face_img = bpy.data.images["Face_Peach_Blush"]
px = np.empty(len(face_img.pixels), dtype=np.float32)
face_img.pixels.foreach_get(px)
px = px.reshape(-1, 4)
px[:, :3] = 1.0 - (1.0 - px[:, :3]) * (1.0 - SKIN_LIGHTEN)
face_img.pixels.foreach_set(px.ravel())
face_img.pack()
SKIN_RGB = tuple(1.0 - (1.0 - c) * (1.0 - SKIN_LIGHTEN) for c in (1.0, 0.859, 0.766))

M_SKIN = flat_mat("Skin", SKIN_RGB, 0.62)
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

decimate(by("Face | peach and blush UV"), 0.45)

# ---------- 4. smooth normals where it reads as soft vinyl ----------
for o in bpy.data.objects:
    if o.type != "MESH" or "pixel rabbit" in o.name:
        continue
    for p in o.data.polygons:
        p.use_smooth = True


# ---------- 5. skin weights (world coords, T-pose) ----------
def smooth(e0, e1, x):
    t = max(0.0, min(1.0, (x - e0) / (e1 - e0)))
    return t * t * (3 - 2 * t)


def torso_w(z):
    s = smooth(-2.3, -1.9, z)
    return {"Spine": s, "Hips": 1 - s}


def arm_w(x, y, z):
    a = smooth(0.46, 1.0, abs(x)) * smooth(-1.75, -1.55, z)
    if abs(x) > 1.2:
        a = 1.0
    lower = smooth(1.0, 1.3, abs(x))
    side = "L" if x > 0 else "R"
    w = {k: v * (1 - a) for k, v in torso_w(z).items()}
    w[f"UpperArm.{side}"] = a * (1 - lower)
    w[f"LowerArm.{side}"] = a * lower
    return w


def leg_w(x, y, z, strength=1.0):
    l = smooth(-2.2, -2.55, z) * strength
    sL = smooth(-0.12, 0.12, x)
    lower = smooth(-2.95, -3.12, z)
    return {
        "Hips": 1 - l,
        "UpperLeg.L": l * sL * (1 - lower),
        "LowerLeg.L": l * sL * lower,
        "UpperLeg.R": l * (1 - sL) * (1 - lower),
        "LowerLeg.R": l * (1 - sL) * lower,
    }


def classify(name):
    if name.startswith("Face | bean eye"):
        # own bones so the site can squash them shut (blink)
        return lambda x, y, z: {("EyeL" if x > 0 else "EyeR"): 1.0}
    if name.startswith(("Face |", "Hair |", "Small smile")):
        return lambda x, y, z: {"Head": 1.0}
    if name.startswith(("Hoodie | ribbed wrist", "Sleeve |")):
        return arm_w
    if name.startswith("Body |"):
        return lambda x, y, z: arm_w(x, y, z) if z > -1.95 else leg_w(x, y, z)
    if name.startswith("Hoodie | original"):
        return lambda x, y, z: arm_w(x, y, z) if z > -1.95 else torso_w(z)
    if name.startswith("Shorts |"):
        return lambda x, y, z: leg_w(x, y, z, 0.7)
    if name.startswith("Sneaker |"):
        return lambda x, y, z: {("LowerLeg.L" if x > 0 else "LowerLeg.R"): 1.0}
    return lambda x, y, z: torso_w(z)


for o in bpy.data.objects:
    if o.type != "MESH":
        continue
    fn = classify(o.name)
    groups = {}
    for v in o.data.vertices:
        for b, val in fn(v.co.x, v.co.y, v.co.z).items():
            if val > 1e-3:
                groups.setdefault(b, []).append((v.index, val))
    for b, lst in groups.items():
        vg = o.vertex_groups.new(name=b)
        for i, val in lst:
            vg.add([i], val, "REPLACE")

# ---------- 6. one mesh ----------
meshes = [o for o in bpy.data.objects if o.type == "MESH"]
with bpy.context.temp_override(active_object=meshes[0], object=meshes[0],
                               selected_objects=meshes, selected_editable_objects=meshes):
    bpy.ops.object.join()
char = meshes[0]
char.name = "Character"
char.data.name = "Character"

bm = bmesh.new()
bm.from_mesh(char.data)
bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
bm.to_mesh(char.data)
bm.free()
print("MESH verts", len(char.data.vertices),
      "tris", sum(len(p.vertices) - 2 for p in char.data.polygons),
      "mats", len(char.data.materials))

# ---------- 7. armature ----------
# T-pose rest. Arm axis slopes slightly down like the sleeves do.
BONES = [
    ("Hips", (0, 0, -2.5), (0, 0, -2.1), None),
    ("Spine", (0, 0, -2.1), (0, 0, -0.62), "Hips"),
    ("Head", (0, 0, -0.62), (0, 0, 1.0), "Spine"),
    # eye bones sit at the centre of each bean eye and point up, so scaling
    # their local Y closes the eye onto its middle line
    ("EyeL", (0.36, -0.925, 0.025), (0.36, -0.925, 0.2), "Head"),
    ("EyeR", (-0.36, -0.925, 0.025), (-0.36, -0.925, 0.2), "Head"),
    ("UpperArm.L", (0.56, -0.02, -1.15), (1.15, -0.02, -1.26), "Spine"),
    ("LowerArm.L", (1.15, -0.02, -1.26), (1.73, -0.02, -1.36), "UpperArm.L"),
    ("UpperArm.R", (-0.56, -0.02, -1.15), (-1.15, -0.02, -1.26), "Spine"),
    ("LowerArm.R", (-1.15, -0.02, -1.26), (-1.73, -0.02, -1.36), "UpperArm.R"),
    ("UpperLeg.L", (0.42, -0.05, -2.5), (0.42, -0.05, -3.0), "Hips"),
    ("LowerLeg.L", (0.42, -0.05, -3.0), (0.42, -0.05, -3.85), "UpperLeg.L"),
    ("UpperLeg.R", (-0.42, -0.05, -2.5), (-0.42, -0.05, -3.0), "Hips"),
    ("LowerLeg.R", (-0.42, -0.05, -3.0), (-0.42, -0.05, -3.85), "UpperLeg.R"),
]
arm_data = bpy.data.armatures.new("Armature")
arm = bpy.data.objects.new("Armature", arm_data)
scene.collection.objects.link(arm)
bpy.context.view_layer.objects.active = arm
bpy.ops.object.mode_set(mode="EDIT")
for name, head, tail, parent in BONES:
    b = arm_data.edit_bones.new(name)
    b.head, b.tail = head, tail
    if parent:
        b.parent = arm_data.edit_bones[parent]
bpy.ops.object.mode_set(mode="OBJECT")

mod = char.modifiers.new("Armature", "ARMATURE")
mod.object = arm
char.parent = arm
arm.location = (0, 0, -FLOOR_Z)  # feet on the ground; the mesh rides along

# ---------- 8. clips ----------
for pb in arm.pose.bones:
    pb.rotation_mode = "QUATERNION"

ad = arm.animation_data_create()


def RX(d): return Matrix.Rotation(math.radians(d), 3, "X")
def RY(d): return Matrix.Rotation(math.radians(d), 3, "Y")
def RZ(d): return Matrix.Rotation(math.radians(d), 3, "Z")


I3 = Matrix.Identity(3)


def key(name, R, frame):
    """R is a rotation about the bone head, expressed in rest space (a joint angle)."""
    pb = arm.pose.bones[name]
    Rr = pb.bone.matrix_local.to_3x3()
    pb.rotation_quaternion = (Rr.inverted() @ R @ Rr).to_quaternion()
    pb.keyframe_insert("rotation_quaternion", frame=frame)


def key_loc(name, offset, frame):
    pb = arm.pose.bones[name]
    Rr = pb.bone.matrix_local.to_3x3()
    pb.location = Rr.inverted() @ Vector(offset)
    pb.keyframe_insert("location", frame=frame)


# joint helpers — character faces -Y; "forward" swings go toward -Y
def arm_drop(side, d): return RY(d if side == "L" else -d)      # T-pose -> hanging
def arm_swing(d): return RX(-d)                                  # + = forward
def elbow(side, d): return RZ(-d if side == "L" else d)          # + = bend forward
def thigh(d): return RX(-d)                                      # + = forward
def knee(d): return RX(d)                                        # + = bend back
def lean(d): return RX(d)                                        # + = forward (spine points up)


ALL = [b[0] for b in BONES]


def clip(name, frames, pose):
    """pose(frame, phase 0..1) -> {bone: R} plus optional 'hips' world offset."""
    act = bpy.data.actions.new(name)
    act.use_fake_user = True
    ad.action = act
    try:
        slot = act.slots.new(id_type="OBJECT", name="Armature")
        ad.action_slot = slot
    except Exception:
        slot = None
    for f in range(1, frames + 2):  # last frame repeats the first -> seamless loop
        t = ((f - 1) % frames) / frames
        p = pose(f, t)
        hips = p.pop("hips", (0, 0, 0))
        for b in ALL:
            if b in ("Head", "EyeL", "EyeR"):
                continue  # left free for the runtime look-at / blink
            key(b, p.get(b, I3), f)
        key_loc("Hips", hips, f)
    act.frame_range = (1, frames + 1)
    ad.action = None
    track = ad.nla_tracks.new()
    track.name = name
    strip = track.strips.new(name, 1, act)
    if slot is not None and hasattr(strip, "action_slot"):
        strip.action_slot = slot
    return (track, act, slot)


def S(t, k=1.0, ph=0.0):
    return math.sin(2 * math.pi * (t * k + ph))


def idle(f, t):
    sw = 3 * S(t)
    return {
        "UpperArm.L": arm_swing(sw) @ arm_drop("L", 62),
        "UpperArm.R": arm_swing(-sw) @ arm_drop("R", 62),
        "LowerArm.L": elbow("L", 8),
        "LowerArm.R": elbow("R", 8),
        "Spine": lean(1.5 * S(t, 1, 0.25)),
        "hips": (0, 0, 0.03 * S(t, 2)),
    }


def sit(f, t):
    # thighs forward on the seat, shins down, hands on the laptop keyboard
    typ = 4 * S(t, 6)
    return {
        "UpperLeg.L": thigh(88), "UpperLeg.R": thigh(88),
        "LowerLeg.L": knee(96 + 3 * S(t)), "LowerLeg.R": knee(96 - 3 * S(t)),
        "UpperArm.L": arm_swing(28) @ arm_drop("L", 72),
        "UpperArm.R": arm_swing(28) @ arm_drop("R", 72),
        "LowerArm.L": elbow("L", 66 + typ),
        "LowerArm.R": elbow("R", 66 - typ),
        "Spine": lean(6),
        "hips": (0, 0, 0.02 * S(t, 1)),
    }


def perch(f, t):
    # sitting on an edge, legs kicking, hands resting beside the hips
    return {
        "UpperLeg.L": thigh(78 + 4 * S(t)), "UpperLeg.R": thigh(78 - 4 * S(t)),
        "LowerLeg.L": knee(70 + 18 * S(t, 1, 0.25)), "LowerLeg.R": knee(70 - 18 * S(t, 1, 0.25)),
        "UpperArm.L": arm_swing(-8) @ arm_drop("L", 74),
        "UpperArm.R": arm_swing(-8) @ arm_drop("R", 74),
        "LowerArm.L": elbow("L", 10),
        "LowerArm.R": elbow("R", 10),
        "Spine": lean(-4),
        "hips": (0, 0, 0.02 * S(t)),
    }


def run(f, t):
    ph = 2 * math.pi * t
    A, K, AA = 42, 70, 34
    return {
        "UpperLeg.L": thigh(A * math.sin(ph)),
        "UpperLeg.R": thigh(-A * math.sin(ph)),
        "LowerLeg.L": knee(K * max(0.0, math.cos(ph))),
        "LowerLeg.R": knee(K * max(0.0, -math.cos(ph))),
        "UpperArm.L": arm_swing(-AA * math.sin(ph)) @ arm_drop("L", 58),
        "UpperArm.R": arm_swing(AA * math.sin(ph)) @ arm_drop("R", 58),
        "LowerArm.L": elbow("L", 85),
        "LowerArm.R": elbow("R", 85),
        "Spine": lean(10),
        "hips": (0, 0, 0.16 * (0.5 + 0.5 * math.cos(2 * ph))),
    }


def wave(f, t):
    # a vinyl-toy wave: the arm stays straight and swings from the shoulder.
    # Bending the elbow creases the thick sleeve, and a raised straight-up arm
    # vanishes behind the hair, so it waves out to the side at 25-55°.
    sw = S(t, 2)
    return {
        "UpperArm.L": arm_swing(4) @ arm_drop("L", 66),
        "LowerArm.L": elbow("L", 12),
        "UpperArm.R": arm_swing(10) @ arm_drop("R", -(40 + 15 * sw)),
        "Spine": Matrix.Rotation(math.radians(-3 * sw), 3, "Y") @ lean(-2),
        "hips": (0, 0, 0.015 * S(t, 4)),
    }


def recline(f, t):
    # sitting on a ledge, leaning back on both hands: one knee up, the other leg
    # stretched out with the foot tapping, a slow rock of the upper body
    tap = max(0.0, S(t, 3))
    return {
        "Spine": lean(-22 + 2.5 * S(t)),
        "UpperLeg.L": thigh(112), "LowerLeg.L": knee(62),
        "UpperLeg.R": thigh(86), "LowerLeg.R": knee(6 + 14 * tap),
        "UpperArm.L": arm_swing(-30) @ arm_drop("L", 76),
        "UpperArm.R": arm_swing(-30) @ arm_drop("R", 76),
        "LowerArm.L": elbow("L", -4),
        "LowerArm.R": elbow("R", -4),
        "hips": (0, 0, 0.012 * S(t)),
    }


tracks = {
    "Idle": clip("Idle", 48, idle),
    "Sit": clip("Sit", 48, sit),
    "Perch": clip("Perch", 48, perch),
    "Run": clip("Run", 14, run),
    "Wave": clip("Wave", 36, wave),
    "Recline": clip("Recline", 48, recline),
}


def solo(name):
    """Preview one clip: mute every track and put that action on top (is_solo is
    ignored in background mode). solo(None) restores the export state."""
    for n, (tr, act, slot) in tracks.items():
        tr.mute = name is not None
    ad.action = None
    if name:
        ad.action = tracks[name][1]
        if tracks[name][2] is not None:
            ad.action_slot = tracks[name][2]


# where things end up in the Sit pose, in three.js coords (x, y=up, z=toward camera)
solo("Sit")
scene.frame_set(12)
for b in ("Hips", "UpperLeg.L", "LowerLeg.L", "LowerArm.L", "LowerArm.R", "Head"):
    pb = arm.pose.bones[b]
    for tag, v in (("head", pb.head), ("tail", pb.tail)):
        w = arm.matrix_world @ v
        print(f"SIT {b}.{tag} three=({w.x:.2f}, {w.z:.2f}, {-w.y:.2f})")
solo(None)

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
    scene.render.resolution_x, scene.render.resolution_y = 520, 640
    shots = [("Idle", 12, "tq"), ("Sit", 12, "tq"), ("Sit", 12, "side"), ("Perch", 20, "tq"),
             ("Run", 4, "side"), ("Run", 8, "side"), ("Run", 4, "tq"), ("Wave", 5, "front"),
             ("Recline", 12, "front"), ("Recline", 12, "tq"), ("Recline", 12, "side")]
    views = {"front": (0, -11, 3.0), "tq": (6, -9.5, 4), "side": (11, -1, 3.2)}
    shots += [("Wave", 14, "front"), ("Wave", 5, "tq")]
    if PREVIEW_ONLY:
        shots = [sh for sh in shots if sh[0] in PREVIEW_ONLY]
    for name, frame, view in shots:
        solo(name)
        scene.frame_set(frame)
        loc = views[view]
        cam.location = loc
        cam.rotation_euler = (Vector((0, 0, 2.75)) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
        scene.render.filepath = os.path.join(PREVIEW, f"clip_{name}_{frame}_{view}.png")
        bpy.ops.render.render(write_still=True)
    solo(None)
    bpy.data.objects.remove(cam, do_unlink=True)
    for lo in lights:
        bpy.data.objects.remove(lo, do_unlink=True)

scene.frame_set(1)
bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format="GLB",
    use_selection=False,
    export_apply=False,
    export_yup=True,
    export_animations=True,
    export_animation_mode="ACTIONS",
    export_nla_strips=True,
    export_force_sampling=True,
    export_frame_range=False,
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
