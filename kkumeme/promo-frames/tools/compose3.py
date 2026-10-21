exec(open('/home/claude/promo/compose.py').read().split('c = background(); d = ImageDraw.Draw(c)')[0])
SC = '/home/claude/promo/screens/'
def bg_dots():
    c = background(); d = ImageDraw.Draw(c)
    for y in range(30, H, 46):
        for x in range(30, W, 46): d.ellipse([x-2, y-2, x+2, y+2], fill=(205, 198, 188, 255))
    return c
def print_photo(path, box, w, h, border=0.055, bright=1.0):
    ph = Image.open(path).convert("RGB").crop(box); ph = ph.point(lambda v: min(255, int(v*bright))); sc = max(w/ph.width, h/ph.height)
    ph = ph.resize((math.ceil(ph.width*sc), math.ceil(ph.height*sc)), Image.LANCZOS)
    ox, oy = (ph.width-w)//2, (ph.height-h)//2; ph = ph.crop((ox, oy, ox+w, oy+h))
    b = int(min(w, h)*border); out = Image.new("RGBA", (w+2*b, h+2*b), (252, 250, 246, 255)); out.paste(ph, (b, b)); return out
def patch(text, w=430, h=170):
    S = 3; im = Image.new("RGBA", (w*S, h*S), (0,0,0,0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, w*S-1, h*S-1], radius=46*S, fill=(250, 247, 240, 255))
    m = 16*S; d.rounded_rectangle([m, m, w*S-m, h*S-m], radius=34*S, fill=(110, 62, 42, 255))
    # felt noise
    a = np.asarray(im).astype(np.float32); rng = np.random.default_rng(1); nz = rng.normal(0, 9, a.shape[:2])
    inner = a[...,3] > 0; a[...,:3][(a[...,0] < 200)] += nz[(a[...,0] < 200)][:, None]; im = Image.fromarray(a.clip(0,255).astype(np.uint8), "RGBA"); d = ImageDraw.Draw(im)
    # stitches
    s = 30*S; x0, y0, x1, y1 = s, s, w*S-s, h*S-s; step = 22*S
    for x in range(x0+30*S, x1-30*S, step): d.line([x, y0, x+11*S, y0], fill=(236, 210, 170), width=4*S); d.line([x, y1, x+11*S, y1], fill=(236, 210, 170), width=4*S)
    for y in range(y0+30*S, y1-30*S, step): d.line([x0, y, x0, y+11*S], fill=(236, 210, 170), width=4*S); d.line([x1, y, x1, y+11*S], fill=(236, 210, 170), width=4*S)
    t = Image.new("RGBA", im.size, (0,0,0,0)); dt = ImageDraw.Draw(t)
    dt.text((w*S//2, h*S//2+4*S), text, font=ImageFont.truetype("/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc", 70*S, index=1), fill=(240, 214, 176), anchor="mm")
    t = t.transform(t.size, Image.AFFINE, (1, 0.22, -0.11*t.height, 0, 1, 0), resample=Image.BICUBIC)
    im.alpha_composite(t); return im.resize((w, h), Image.LANCZOS)
def label(text, bgc, w=None, fs=30):
    f = F(fs, "Medium"); tw = int(ImageDraw.Draw(Image.new("RGB", (1,1))).textlength(text, font=f)); w = w or tw + 64; h = fs + 34
    im = Image.new("RGBA", (w, h), bgc + (255,)); ImageDraw.Draw(im).text((w//2, h//2), text, font=f, fill=(255,255,255), anchor="mm"); return im
def button(r=90, col=(226, 48, 58)):
    S = 3; R = r*S; im = Image.new("RGBA", (2*R+40*S, 2*R+60*S), (0,0,0,0)); d = ImageDraw.Draw(im); cx, cy = R+20*S, R+46*S
    d.ellipse([cx-R-12*S, cy-R-12*S, cx+R+12*S, cy+R+12*S], fill=(252, 250, 246))  # die-cut
    d.polygon([(cx+6*S, cy-R+6*S), (cx+60*S, cy-R-34*S), (cx+20*S, cy-R+10*S)], fill=(252,250,246)); 
    d.ellipse([cx-R, cy-R, cx+R, cy+R], fill=col); d.ellipse([cx-R*0.75, cy-R*0.8, cx-R*0.1, cy-R*0.35], fill=(255, 120, 120))
    d.ellipse([cx+8*S, cy-R-26*S, cx+56*S, cy-R+6*S], fill=(70, 160, 70))
    for dx in (-26, 26): d.ellipse([cx+dx*S-16*S, cy-16*S, cx+dx*S+16*S, cy+16*S], fill=(255, 235, 235))
    return im.resize((im.width//S, im.height//S), Image.LANCZOS)

c = bg_dots(); d = ImageDraw.Draw(c)
# left
shadow_place(c, patch("October"), 60, 50, rot=-4, blur=8, off=(5, 7))
shadow_place(c, print_photo(PH+"street-flash.png", (0, 0, 520, 760), 300, 420, bright=1.35), 700, 120, rot=6)
shadow_place(c, framed("window-retro", SC+"sky.png", 640), 70, 290, rot=-2)
shadow_place(c, framed("pet-egg", SC+"pixel-pet.png", 250, (0.5, 0.5)), 900, 330, rot=10)
shadow_place(c, label("Oct. 21", (79, 104, 140)), 560, 890, rot=0, blur=5, off=(3, 5), op=0.2)
shadow_place(c, framed("flip-phone", SC+"wallpaper.png", 230, (0.5, 0.3)), 110, 830, rot=-7)
cake = Image.open(WK+"cake.png"); cake = cake.resize((300, int(300*cake.height/cake.width)), Image.LANCZOS)
shadow_place(c, cake, 400, 1010, rot=-6, blur=8, off=(5, 7))
# seam
shadow_place(c, framed("window-glossy", "cafe-strawberry.png", 600, (0.5, 0.35)), 770, 700, rot=3)
# right
shadow_place(c, print_photo(PH+"laughing-wide.png", (1180, 0, 1536, 420), 300, 330), 1230, 110, rot=-7)
shadow_place(c, framed("crt-tv", "laughing-wide.png", 480, (0.5, 0.3)), 1560, 60, rot=-4)
shadow_place(c, button(70), 1400, 520, rot=-12, blur=6, off=(4, 6))
sf = Image.open(WK + "sticker-face.png"); sf = sf.resize((380, int(380*sf.height/sf.width)), Image.LANCZOS)
pl = peeled(sf, (sf.width*0.74, sf.height*0.80), (1.0, 0.85)); shadow_place(c, pl, 1720, 600, rot=7, blur=8, off=(6, 8))
shadow_place(c, label("11:11", (64, 160, 130)), 1500, 900, rot=-2, blur=5, off=(3, 5), op=0.2)
shadow_place(c, framed("handheld-game", SC+"pixel-game.png", 520, (0.5, 0.5)), 1450, 1060, rot=-5)
logo = Image.open("/home/claude/devrocket-media/kkumeme/brand/logo-horizontal.png").convert("RGBA"); logo = logo.resize((150, int(150*logo.height/logo.width)), Image.LANCZOS)
c.alpha_composite(logo, (W - 190, 40))
c = c.convert("RGB"); c.save(WK+"wide.png"); c.crop((0, 0, 1080, H)).save(WK+"slide-1.png"); c.crop((1080, 0, 2160, H)).save(WK+"slide-2.png")
c.resize((1080, 675)).save("/tmp/claude-0/wide.jpg", quality=88)
