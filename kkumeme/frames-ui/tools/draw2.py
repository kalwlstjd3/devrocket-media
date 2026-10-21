import sys, json
sys.argv=[sys.argv[0], sys.argv[1]]
exec(open('/home/claude/frames-ui/draw.py').read().split('# ---------- 1.')[0])
meta.update(json.load(open(f"{OUT}/frames.json")))

def film():
    W, H = 900*S, 1024*S
    img = Image.new("RGBA", (W, H), (0,0,0,0)); d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W-1, H-1], fill="#1c1a1e")
    # sprockets left/right
    sw, sh, gap = 44*S, 30*S, 26*S
    for x in (30*S, W-30*S-sw):
        y = 22*S
        while y + sh < H - 10*S:
            d.rounded_rectangle([x, y, x+sw, y+sh], radius=6*S, fill=(0,0,0,0)); y += sh + gap
    a = img.getchannel("A")
    # punch sprockets transparent
    da = ImageDraw.Draw(a)
    for x in (30*S, W-30*S-sw):
        y = 22*S
        while y + sh < H - 10*S:
            da.rounded_rectangle([x, y, x+sw, y+sh], radius=6*S, fill=0); y += sh + gap
    img.putalpha(a); d = ImageDraw.Draw(img)
    hole = (110*S, 90*S, W-110*S, H-110*S)
    f = font(26*S, "Bold")
    d.text((110*S, 46*S), "KKUME 400", font=f, fill="#e8a33c", anchor="lm")
    d.text((W-110*S, 46*S), "▶ 12A", font=f, fill="#e8a33c", anchor="rm")
    d.text((110*S, H-62*S), "13", font=f, fill="#e8a33c", anchor="lm")
    d.text((W-110*S, H-62*S), "▶ 13A", font=f, fill="#e8a33c", anchor="rm")
    finish(img, "film-cell", hole)

def music():
    W, H = 760*S, 1024*S; r = 70*S
    img = Image.new("RGBA", (W, H), (0,0,0,0)); d = ImageDraw.Draw(img)
    d.rounded_rectangle([0,0,W-1,H-1], radius=r, fill="#111014")
    d.rounded_rectangle([14*S,14*S,W-15*S,H-15*S], radius=r-12*S, fill="#fbf7f2")
    # status bar
    d.text((60*S, 62*S), "11:11", font=font(26*S, "Bold"), fill="#111", anchor="lm")
    for i in range(4): d.rectangle([W-150*S+i*14*S, 70*S-(i+1)*5*S, W-140*S+i*14*S, 72*S], fill="#111")
    d.rounded_rectangle([W-86*S, 52*S, W-46*S, 74*S], radius=5*S, outline="#111", width=3*S); d.rectangle([W-82*S, 56*S, W-56*S, 70*S], fill="#111")
    d.text((W//2, 128*S), "지금 재생 중", font=font(26*S), fill="#8a8590", anchor="mm")
    m = 110*S; top = 160*S; side = W - 2*m
    hole = (m, top, m+side, top+side)
    d.rounded_rectangle([m-4*S, top-4*S, m+side+4*S, top+side+4*S], radius=14*S, fill="#e9e3dc")
    ty = top + side + 50*S
    d.text((m, ty), "오늘의 나", font=font(40*S, "Bold"), fill="#111", anchor="lm")
    d.text((m, ty+52*S), "kkume.me", font=font(28*S), fill="#8a8590", anchor="lm")
    heart(d, W-m-20*S, ty+4*S, 20*S, "#ff4f8b")
    py = ty + 96*S
    d.rounded_rectangle([m, py, W-m, py+8*S], radius=4*S, fill="#e3dcd5")
    d.rounded_rectangle([m, py, m+int(side*0.38), py+8*S], radius=4*S, fill="#111")
    d.ellipse([m+int(side*0.38)-11*S, py-7*S, m+int(side*0.38)+11*S, py+15*S], fill="#111")
    d.text((m, py+36*S), "1:11", font=font(22*S), fill="#8a8590", anchor="lm"); d.text((W-m, py+36*S), "3:33", font=font(22*S), fill="#8a8590", anchor="rm")
    cy = py + 92*S; cx = W//2
    d.ellipse([cx-46*S, cy-46*S, cx+46*S, cy+46*S], fill="#111")
    d.rectangle([cx-16*S, cy-20*S, cx-6*S, cy+20*S], fill="#fff"); d.rectangle([cx+6*S, cy-20*S, cx+16*S, cy+20*S], fill="#fff")
    for sgn in (-1, 1):
        x = cx + sgn*170*S
        tri = [(x-sgn*14*S, cy-18*S), (x-sgn*14*S, cy+18*S), (x+sgn*14*S, cy)]
        d.polygon(tri, fill="#111"); bx = x+sgn*14*S
        d.rectangle([min(bx, bx+sgn*5*S), cy-18*S, max(bx, bx+sgn*5*S), cy+18*S], fill="#111")
    finish(img, "music-player", hole)

music()
json.dump(meta, open(f"{OUT}/frames.json", "w"), indent=1)
print(json.dumps({k: meta[k] for k in ("film-cell", "music-player")}))
