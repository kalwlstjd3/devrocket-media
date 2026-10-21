from PIL import Image, ImageDraw, ImageFont
import json, os, sys
OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
FD = "/usr/share/fonts/opentype/noto/"
def font(sz, w="Regular"):
    p = FD + f"NotoSansCJK-{w}.ttc"
    if not os.path.exists(p): p = FD + "NotoSansCJK-Regular.ttc"
    return ImageFont.truetype(p, sz, index=1)
S = 2  # supersample
meta = {}

def bevel(d, x0, y0, x1, y1, raised=True, t=2):
    # classic 2-level bevel; t = unit px (already scaled)
    lt1, lt2, dk1, dk2 = ("#ffffff", "#dfdfdf", "#808080", "#0a0a0a")
    if raised:
        outer_tl, outer_br, inner_tl, inner_br = lt2, dk2, lt1, dk1
    else:
        outer_tl, outer_br, inner_tl, inner_br = dk1, lt1, dk2, lt2
    for i, (tl, br) in enumerate([(outer_tl, outer_br), (inner_tl, inner_br)]):
        o = i * t
        d.rectangle([x0+o, y0+o, x1-o, y0+o+t-1], fill=tl)
        d.rectangle([x0+o, y0+o, x0+o+t-1, y1-o], fill=tl)
        d.rectangle([x0+o, y1-o-t+1, x1-o, y1-o], fill=br)
        d.rectangle([x1-o-t+1, y0+o, x1-o, y1-o], fill=br)

def hgrad(img, box, c0, c1):
    x0, y0, x1, y1 = box
    a = Image.new("RGBA", (x1-x0, y1-y0))
    da = ImageDraw.Draw(a)
    w = x1-x0
    c0 = tuple(int(c0[i:i+2], 16) for i in (1,3,5)); c1 = tuple(int(c1[i:i+2], 16) for i in (1,3,5))
    for x in range(w):
        f = x/(w-1); da.line([(x,0),(x,y1-y0)], fill=tuple(round(c0[k]+(c1[k]-c0[k])*f) for k in range(3))+(255,))
    img.alpha_composite(a, (x0, y0))

def vgrad(img, box, stops):
    x0, y0, x1, y1 = box
    a = Image.new("RGBA", (x1-x0, y1-y0)); da = ImageDraw.Draw(a); h = y1-y0
    cs = [(p, tuple(int(c[i:i+2],16) for i in (1,3,5))) for p,c in stops]
    for y in range(h):
        f = y/(h-1)
        for (p0,c0),(p1,c1) in zip(cs, cs[1:]):
            if p0 <= f <= p1:
                g = (f-p0)/(p1-p0) if p1>p0 else 0
                col = tuple(round(c0[k]+(c1[k]-c0[k])*g) for k in range(3)); break
        da.line([(0,y),(x1-x0,y)], fill=col+(255,))
    img.alpha_composite(a, (x0, y0))

def heart(d, cx, cy, r, fill):
    d.ellipse([cx-r, cy-r*0.9, cx, cy+r*0.1], fill=fill)
    d.ellipse([cx, cy-r*0.9, cx+r, cy+r*0.1], fill=fill)
    d.polygon([(cx-r*0.97, cy-r*0.25), (cx+r*0.97, cy-r*0.25), (cx, cy+r*0.95)], fill=fill)

def finish(img, name, hole):
    W, H = img.size
    out = img.resize((W//S, H//S), Image.LANCZOS)
    # punch hole exactly (alpha 0) after resize
    hx0, hy0, hx1, hy1 = [v//S for v in hole]
    a = out.getchannel("A"); da = ImageDraw.Draw(a); da.rectangle([hx0, hy0, hx1-1, hy1-1], fill=0); out.putalpha(a)
    w, h = out.size
    out.save(f"{OUT}/{name}.png")
    meta[name] = {"w": w, "h": h, "hole": {"x": round(hx0/w,4), "y": round(hy0/h,4), "w": round((hx1-hx0)/w,4), "h": round((hy1-hy0)/h,4)}}

def caption_btn(d, box, glyph, t):
    x0,y0,x1,y1 = box
    d.rectangle(box, fill="#c0c0c0"); bevel(d, x0,y0,x1,y1, True, t)
    cx, cy = (x0+x1)//2, (y0+y1)//2; u = (x1-x0)//8
    if glyph == "min": d.rectangle([cx-2*u, cy+u, cx+u, cy+u+t], fill="#000")
    if glyph == "max":
        d.rectangle([cx-2*u, cy-2*u, cx+2*u, cy+2*u], outline="#000", width=t); d.rectangle([cx-2*u, cy-2*u, cx+2*u, cy-2*u+t*2], fill="#000")
    if glyph == "close":
        d.line([cx-2*u, cy-2*u, cx+2*u, cy+2*u], fill="#000", width=t*2); d.line([cx-2*u, cy+2*u, cx+2*u, cy-2*u], fill="#000", width=t*2)

# ---------- 1. retro window (98 style) ----------
def win98():
    W, H = 1024*S, 860*S; t = 3*S
    img = Image.new("RGBA", (W, H), (0,0,0,0)); d = ImageDraw.Draw(img)
    d.rectangle([0,0,W-1,H-1], fill="#c0c0c0"); bevel(d, 0,0,W-1,H-1, True, t)
    tb = (4*t, 4*t, W-4*t, 4*t+46*S)
    hgrad(img, tb, "#000080", "#1084d0"); d = ImageDraw.Draw(img)
    heart(d, tb[0]+22*S, tb[1]+25*S, 12*S, "#ff8fb8")
    d.text((tb[0]+44*S, tb[1]+23*S), "내사진.jpg", font=font(26*S, "Bold"), fill="#ffffff", anchor="lm")
    bw, bh = 40*S, 34*S; by = tb[1] + (tb[3]-tb[1]-bh)//2; bx = tb[2]-6*S-bw
    caption_btn(d, (bx, by, bx+bw, by+bh), "close", S*2)
    caption_btn(d, (bx-bw-10*S, by, bx-10*S, by+bh), "max", S*2)
    caption_btn(d, (bx-2*bw-14*S, by, bx-bw-14*S, by+bh), "min", S*2)
    my = tb[3] + 26*S
    x = 4*t + 14*S
    for m in ["파일", "편집", "보기", "꾸미기", "도움말"]:
        d.text((x, my), m, font=font(24*S), fill="#000", anchor="lm")
        w = d.textlength(m, font=font(24*S)); d.line([x, my+15*S, x+w*0.45, my+15*S], fill="#000", width=S)
        x += w + 34*S
    cy0 = tb[3] + 52*S; sb = 46*S
    content = (4*t+8*S, cy0, W-4*t-8*S, H-4*t-sb-10*S)
    bevel(d, *content, False, t)
    hole = (content[0]+2*t, content[1]+2*t, content[2]-2*t+1, content[3]-2*t+1)
    sy0 = H-4*t-sb; 
    for (a,b,txt) in [(4*t+8*S, W*0.62, "꾸밈 사진 보기"), (W*0.62+8*S, W-4*t-8*S, "100%  ♡")]:
        bevel(d, int(a), sy0, int(b), H-4*t-4*S, False, S)
        d.text((int(a)+14*S, (sy0+H-4*t-4*S)//2), txt, font=font(22*S), fill="#000", anchor="lm")
    finish(img, "window-retro", hole)

# ---------- 2. glossy window (XP style) ----------
def winxp():
    W, H = 1024*S, 840*S; r = 22*S; bd = 8*S; th = 58*S
    img = Image.new("RGBA", (W, H), (0,0,0,0))
    mask = Image.new("L", (W, H), 0); dm = ImageDraw.Draw(mask)
    dm.rounded_rectangle([0,0,W-1,H-1+r], radius=r, fill=255); dm.rectangle([0,H-r,W-1,H-1], fill=255)
    frame = Image.new("RGBA", (W, H)); vgrad(frame, (0,0,W,H), [(0,"#0a5fe8"),(0.04,"#3d8ff7"),(0.07,"#0b58e0"),(0.5,"#0a4fd6"),(1,"#0838b8")])
    img.paste(frame, (0,0), mask); d = ImageDraw.Draw(img)
    # title gloss
    gl = Image.new("RGBA", (W, th)); vgrad(gl, (0,0,W,th), [(0,"#5aa2ff"),(0.12,"#2f7cf5"),(0.45,"#0b5be6"),(0.85,"#0a52d8"),(1,"#0848c6")])
    gm = Image.new("L", (W, th), 0); ImageDraw.Draw(gm).rounded_rectangle([0,0,W-1,th+r], radius=r, fill=255)
    img.paste(gl, (0,0), gm); d = ImageDraw.Draw(img)
    heart(d, 30*S, th//2+1*S, 13*S, "#ffd1e3")
    d.text((54*S+2*S, th//2+2*S), "내사진.jpg", font=font(28*S, "Bold"), fill="#0a2a7a", anchor="lm")
    d.text((54*S, th//2), "내사진.jpg", font=font(28*S, "Bold"), fill="#ffffff", anchor="lm")
    bs = 40*S; by = (th-bs)//2; x = W-12*S-bs
    def xpbtn(x, kind):
        col = [(0,"#ff9a7a"),(0.5,"#e2552f"),(1,"#c43a1a")] if kind=="close" else [(0,"#7fb2ff"),(0.5,"#2f6fe8"),(1,"#1d55cf")]
        b = Image.new("RGBA", (bs, bs)); vgrad(b, (0,0,bs,bs), col)
        m = Image.new("L", (bs, bs), 0); ImageDraw.Draw(m).rounded_rectangle([0,0,bs-1,bs-1], radius=6*S, fill=255)
        img.paste(b, (x, by), m); dd = ImageDraw.Draw(img)
        dd.rounded_rectangle([x, by, x+bs-1, by+bs-1], radius=6*S, outline="#ffffff", width=2*S)
        c = (x+bs//2, by+bs//2); u = 8*S
        if kind == "close":
            dd.line([c[0]-u, c[1]-u, c[0]+u, c[1]+u], fill="#fff", width=4*S); dd.line([c[0]-u, c[1]+u, c[0]+u, c[1]-u], fill="#fff", width=4*S)
        elif kind == "max": dd.rectangle([c[0]-u, c[1]-u, c[0]+u, c[1]+u], outline="#fff", width=3*S); dd.rectangle([c[0]-u, c[1]-u, c[0]+u, c[1]-u+4*S], fill="#fff")
        else: dd.rectangle([c[0]-u, c[1]+u-4*S, c[0]+2*S, c[1]+u], fill="#fff")
    xpbtn(x, "close"); xpbtn(x-bs-4*S, "max"); xpbtn(x-2*bs-8*S, "min")
    d = ImageDraw.Draw(img)
    body = (bd, th, W-bd-1, H-bd-1); d.rectangle(body, fill="#ece9d8")
    # toolbar line
    ty = th + 34*S
    x = bd + 16*S
    for m in ["파일", "편집", "보기", "즐겨찾기"]:
        d.text((x, th+17*S), m, font=font(23*S), fill="#000", anchor="lm"); x += d.textlength(m, font=font(23*S)) + 30*S
    d.line([bd, ty, W-bd, ty], fill="#d4d0c8", width=2*S)
    content = (bd+14*S, ty+12*S, W-bd-14*S, H-bd-14*S)
    d.rectangle(content, fill="#7f9db9"); 
    hole = (content[0]+2*S, content[1]+2*S, content[2]-2*S+1, content[3]-2*S+1)
    finish(img, "window-glossy", hole)

# ---------- 3. alert dialog ----------
def alert():
    W, H = 1024*S, 640*S; t = 3*S
    img = Image.new("RGBA", (W, H), (0,0,0,0)); d = ImageDraw.Draw(img)
    d.rectangle([0,0,W-1,H-1], fill="#c0c0c0"); bevel(d, 0,0,W-1,H-1, True, t)
    tb = (4*t, 4*t, W-4*t, 4*t+46*S)
    hgrad(img, tb, "#000080", "#1084d0"); d = ImageDraw.Draw(img)
    d.text((tb[0]+16*S, tb[1]+23*S), "알림", font=font(26*S, "Bold"), fill="#fff", anchor="lm")
    bw, bh = 40*S, 34*S; by = tb[1]+(tb[3]-tb[1]-bh)//2
    caption_btn(d, (tb[2]-6*S-bw, by, tb[2]-6*S, by+bh), "close", S*2)
    pad = 30*S; ph = H - tb[3] - 2*pad - 4*t
    content = (4*t+pad, tb[3]+pad, 4*t+pad+int(ph*1.0), tb[3]+pad+ph)
    bevel(d, *content, False, t)
    hole = (content[0]+2*t, content[1]+2*t, content[2]-2*t+1, content[3]-2*t+1)
    tx = content[2] + 44*S
    # info icon
    d.ellipse([tx, content[1]+10*S, tx+64*S, content[1]+74*S], fill="#ffffff", outline="#000080", width=4*S)
    d.text((tx+32*S, content[1]+42*S), "♡", font=font(38*S, "Bold"), fill="#ff5c93", anchor="mm")
    d.text((tx, content[1]+120*S), "사진을 열었어요!", font=font(36*S, "Bold"), fill="#000", anchor="lm")
    d.text((tx, content[1]+176*S), "오늘도 귀여움 +1", font=font(30*S), fill="#000", anchor="lm")
    bx0, bx1 = tx, tx+190*S; by1 = content[3]; by0 = by1-62*S
    d.rectangle([bx0, by0, bx1, by1], fill="#c0c0c0"); bevel(d, bx0, by0, bx1, by1, True, t)
    d.rectangle([bx0-S*2, by0-S*2, bx1+S*2, by1+S*2], outline="#000", width=S*2)
    d.text(((bx0+bx1)//2, (by0+by1)//2), "확인", font=font(28*S), fill="#000", anchor="mm")
    d.rectangle([bx0+10*S, by0+9*S, bx1-10*S, by1-9*S], outline="#000", width=S)  # focus rect
    finish(img, "window-alert", hole)

win98(); winxp(); alert()
json.dump(meta, open(f"{OUT}/frames.json", "w"), indent=1)
print(json.dumps(meta))
