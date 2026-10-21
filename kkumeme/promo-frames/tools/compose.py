import json, math, numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps
from scipy import ndimage as ndi
FA = "/home/claude/frames/ai/out/"; FU = "/home/claude/frames-ui/out/"; PH = "/home/claude/promo/zip/"; WK = "/home/claude/promo/work/"
meta = json.load(open(FA + "frames.json")); meta.update(json.load(open(FU + "frames.json")))
def F(sz, w="Black"): return ImageFont.truetype(f"/usr/share/fonts/opentype/noto/NotoSansCJK-{w}.ttc", sz, index=1)
W, H = 2160, 1350
PURPLE = (73, 49, 101)

def background():
    bg = Image.new("RGBA", (W, H), (255, 226, 236, 255))
    ov = Image.new("RGBA", (W, H), (0,0,0,0)); d = ImageDraw.Draw(ov); s = 54
    for x in range(0, W, s*2): d.rectangle([x, 0, x+s-1, H], fill=(255, 170, 200, 70))
    for y in range(0, H, s*2): d.rectangle([0, y, W, y+s-1], fill=(255, 170, 200, 70))
    bg.alpha_composite(ov); return bg

def framed(fid, photo, width, focus=(0.5, 0.4)):
    fr = Image.open((FA if fid in json.load(open(FA+"frames.json")) else FU) + fid + ".png").convert("RGBA")
    m = meta[fid]; fw, fh = fr.size; h = m["hole"]
    hx, hy, hw, hh = h["x"]*fw, h["y"]*fh, h["w"]*fw, h["h"]*fh
    ex = 0.03; bx0, by0 = int(hx - hw*ex), int(hy - hh*ex); bw, bh = int(hw*(1+2*ex)), int(hh*(1+2*ex))
    ph = Image.open(PH + photo).convert("RGBA")
    sc = max(bw/ph.width, bh/ph.height); ph = ph.resize((math.ceil(ph.width*sc), math.ceil(ph.height*sc)), Image.LANCZOS)
    ox = int((ph.width-bw)*focus[0]); oy = int((ph.height-bh)*focus[1]); ph = ph.crop((ox, oy, ox+bw, oy+bh))
    out = Image.new("RGBA", fr.size, (0,0,0,0)); out.paste(ph, (bx0, by0)); out.alpha_composite(fr)
    k = width / fw; return out.resize((int(fw*k), int(fh*k)), Image.LANCZOS)

def shadow_place(canvas, img, x, y, rot=0, blur=14, off=(10, 14), op=0.28):
    if rot: img = img.rotate(rot, resample=Image.BICUBIC, expand=True)
    a = img.getchannel("A"); sh = Image.new("RGBA", img.size, (60, 20, 50, 0)); sh.putalpha(a.point(lambda v: int(v*op)))
    pad = blur*3; big = Image.new("RGBA", (img.width+2*pad, img.height+2*pad), (0,0,0,0)); big.alpha_composite(sh, (pad, pad)); big = big.filter(ImageFilter.GaussianBlur(blur))
    canvas.alpha_composite(big, (int(x-pad+off[0]), int(y-pad+off[1]))); canvas.alpha_composite(img, (int(x), int(y))); return img.size

def peeled(st, p, n):
    """fold the part beyond line (point p, normal n) back over the sticker"""
    pad = int(max(st.size)*0.6); S = Image.new("RGBA", (st.width+2*pad, st.height+2*pad), (0,0,0,0)); S.alpha_composite(st, (pad, pad))
    p = (p[0]+pad, p[1]+pad); nx, ny = n; L = math.hypot(nx, ny); nx, ny = nx/L, ny/L
    A = np.asarray(S.getchannel("A")).astype(np.float32)
    yy, xx = np.mgrid[0:S.height, 0:S.width]; side = (xx-p[0])*nx + (yy-p[1])*ny
    front = S.copy(); fa = A.copy(); fa[side > 0] = 0; front.putalpha(Image.fromarray(fa.astype(np.uint8)))
    cut = A.copy(); cut[side <= 0] = 0; cutI = Image.fromarray(cut.astype(np.uint8))
    pn = p[0]*nx + p[1]*ny
    aff = (1-2*nx*nx, -2*nx*ny, 2*pn*nx, -2*nx*ny, 1-2*ny*ny, 2*pn*ny)
    backA = cutI.transform(S.size, Image.AFFINE, aff, resample=Image.BILINEAR)
    # back paper: light gradient along normal (darker near fold = curl)
    g = np.clip(1 - np.abs(side)/ (max(st.size)*0.25), 0, 1)
    shade = (236 - 26*g)[..., None] * np.array([1, 0.985, 0.96])
    back = Image.fromarray(np.dstack([shade, np.asarray(backA)]).astype(np.uint8), "RGBA")
    # shadow of flap onto sticker
    sh = Image.new("RGBA", S.size, (40, 20, 40, 0)); sh.putalpha(backA.point(lambda v: int(v*0.35)).filter(ImageFilter.GaussianBlur(10)))
    out = front.copy(); out.alpha_composite(sh, (-6, 6)); out.alpha_composite(back)
    return out.crop(out.getbbox())

def star(d, cx, cy, r, fill, k=0.45, pts=5, rot=-90):
    P = []
    for i in range(pts*2):
        rr = r if i % 2 == 0 else r*k; a = math.radians(rot + i*180/pts); P.append((cx+rr*math.cos(a), cy+rr*math.sin(a)))
    d.polygon(P, fill=fill)
def sparkle(d, cx, cy, r, fill): star(d, cx, cy, r, fill, k=0.18, pts=4)
def heart(d, cx, cy, r, fill):
    d.ellipse([cx-r, cy-r*0.9, cx, cy+r*0.1], fill=fill); d.ellipse([cx, cy-r*0.9, cx+r, cy+r*0.1], fill=fill)
    d.polygon([(cx-r*0.97, cy-r*0.25), (cx+r*0.97, cy-r*0.25), (cx, cy+r*0.95)], fill=fill)

def outlined_text(c, xy, txt, font, fill, stroke, sw, anchor="la"):
    d = ImageDraw.Draw(c); d.text(xy, txt, font=font, fill=fill, stroke_width=sw, stroke_fill=stroke, anchor=anchor)

c = background(); d = ImageDraw.Draw(c)
# doodles behind
for (x, y, r, col) in [(140, 640, 30, (255,228,131,255)), (1010, 90, 22, (255,255,255,255)), (1300, 1240, 26, (255,228,131,255)), (2080, 520, 24, (255,255,255,255)), (620, 1270, 20, (255,255,255,255))]:
    star(d, x, y, r, col)
for (x, y, r) in [(560, 340, 26), (1460, 70, 22), (2100, 1080, 30), (980, 1180, 22)]: sparkle(d, x, y, r, (255,255,255,255))
for (x, y, r) in [(80, 380, 22), (1990, 360, 20), (1180, 650, 18)]: heart(d, x, y, r, (255, 92, 147, 255))

# headline
outlined_text(c, (70, 60), "화면 속에", F(124), PURPLE, (255,255,255), 10)
outlined_text(c, (70, 205), "내 사진 쏙", F(124), PURPLE, (255,255,255), 10)
d = ImageDraw.Draw(c); d.rounded_rectangle([76, 368, 470, 424], radius=28, fill=(255,255,255)); d.text((273, 396), "꾸밈 사진 프레임", font=F(30, "Bold"), fill=PURPLE, anchor="mm")

# pieces (left → seam → right)
shadow_place(c, framed("pet-egg", "peace-closeup.png", 300, (0.5, 0.3)), 690, 70, rot=7)
shadow_place(c, framed("window-retro", "street-flash.png", 640, (0.5, 0.3)), 50, 470, rot=-3)
shadow_place(c, framed("window-glossy", "cafe-strawberry.png", 620, (0.5, 0.35)), 820, 300, rot=-2)
shadow_place(c, framed("flip-phone", "mirror-selfie.png", 250, (0.5, 0.15)), 730, 700, rot=5)
shadow_place(c, framed("crt-tv", "laughing-wide.png", 470, (0.5, 0.3)), 1500, 60, rot=-4)
shadow_place(c, framed("handheld-game", "sunglasses-tilt.png", 560, (0.5, 0.35)), 1120, 860, rot=-5)
shadow_place(c, framed("instant-film", "film-camera.png", 300, (0.5, 0.35)), 1440, 430, rot=6)
# stickers
full = Image.open(WK + "sticker-full.png"); full = full.resize((int(330*full.width/full.height), 330), Image.LANCZOS)
shadow_place(c, full, 440, 1005, rot=-8, blur=8, off=(6, 8))
sf = Image.open(WK + "sticker-face.png"); sf = sf.resize((430, int(430*sf.height/sf.width)), Image.LANCZOS)
pl = peeled(sf, (sf.width*0.74, sf.height*0.80), (1.0, 0.85))
shadow_place(c, pl, 1690, 620, rot=7, blur=8, off=(6, 8))
# peel hint
d = ImageDraw.Draw(c)
outlined_text(c, (1760, 1060), "떼었다 붙였다!", F(34, "Bold"), (255, 92, 147), (255,255,255), 5)
# brand bottom right
logo = Image.open("/home/claude/devrocket-media/kkumeme/brand/logo-horizontal.png").convert("RGBA"); logo = logo.resize((260, int(260*logo.height/logo.width)), Image.LANCZOS)
bx, by = W - 70 - 560, H - 120
d.rounded_rectangle([bx, by-14, W-60, H-34], radius=40, fill=(255,255,255,235))
c.alpha_composite(logo, (bx+24, by + (H-34-by+14-logo.height)//2 - 7))
d.text((bx+300, (by-14+H-34)//2), "kkume.me", font=F(40, "Black"), fill=PURPLE, anchor="lm")
c = c.convert("RGB"); c.save("/home/claude/promo/work/wide.png")
c.crop((0, 0, 1080, H)).save("/home/claude/promo/work/slide-1.png"); c.crop((1080, 0, 2160, H)).save("/home/claude/promo/work/slide-2.png")
c.resize((1080, 675)).save("/tmp/claude-0/wide.jpg", quality=88)
