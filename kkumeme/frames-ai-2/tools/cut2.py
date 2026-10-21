import subprocess, sys, json, numpy as np
from PIL import Image
from scipy import ndimage as ndi
picks = {"camcorder":"camcorder-2","compact-mirror":"compact-mirror-1","crt-monitor":"crt-monitor-1","heart-locket":"heart-locket-1",
         "keychain-frame":"keychain-frame-1","mp3-player":"mp3-player-1","retro-handheld-v":"retro-handheld-v-1","slide-phone":"slide-phone-2"}
slot = {"compact-mirror":"ellipse","heart-locket":"heart"}
meta = {}
for fid, src in picks.items():
    out = f"/home/claude/frames2/out/{fid}.png"
    subprocess.run(["python3", "/home/claude/frames/cut.py", f"/home/claude/frames2/zip/src/{src}.png", out], check=True, capture_output=True)
    im = Image.open(out); A = np.asarray(im.getchannel("A")) < 20
    lab, n = ndi.label(A); edge = set(np.unique(np.r_[lab[0], lab[-1], lab[:,0], lab[:,-1]])) - {0}
    inner = [(ndi.sum(A, lab, i), i) for i in range(1, n+1) if i not in edge]
    inner.sort(reverse=True); hole = lab == inner[0][1]
    ys, xs = np.where(hole); w, h = im.size
    meta[fid] = {"w": w, "h": h, "slot": slot.get(fid, "rect"), "hole": {"x": round(xs.min()/w,4), "y": round(ys.min()/h,4), "w": round((xs.max()-xs.min()+1)/w,4), "h": round((ys.max()-ys.min()+1)/h,4)}}
    print(fid, im.size, meta[fid]["hole"], "inner comps", len(inner), "second", inner[1][0] if len(inner)>1 else 0)
json.dump(meta, open("/home/claude/frames2/out/frames.json","w"), indent=1)
