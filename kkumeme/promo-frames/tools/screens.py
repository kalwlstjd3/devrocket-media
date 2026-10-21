import numpy as np, math, random
from PIL import Image, ImageDraw, ImageFilter
OUT = "/home/claude/promo/screens/"; import os; os.makedirs(OUT, exist_ok=True)
random.seed(7)
def grad(w, h, top, bot):
    t = np.linspace(0, 1, h)[:, None, None]; a = np.array(top)[None,None,:]*(1-t) + np.array(bot)[None,None,:]*t
    return Image.fromarray(np.repeat(a, w, 1).astype(np.uint8), "RGB")

# 1. y2k sky with soft clouds (landscape 1200x900)
sky = grad(1200, 900, (110, 165, 245), (205, 228, 255)).convert("RGBA")
cl = Image.new("RGBA", sky.size, (255,255,255,0)); d = ImageDraw.Draw(cl)
for cx, cy, s in [(300, 300, 1.0), (850, 220, 0.8), (700, 620, 1.2), (180, 700, 0.7)]:
    for dx, dy, r in [(-120, 20, 110), (0, -30, 140), (130, 10, 115), (60, 60, 120), (-60, 70, 110)]:
        d.ellipse([cx+dx*s-r*s, cy+dy*s-r*s, cx+dx*s+r*s, cy+dy*s+r*s], fill=(255,255,255,235))
cl = cl.filter(ImageFilter.GaussianBlur(18)); sky.alpha_composite(cl); sky.convert("RGB").save(OUT+"sky.png")

# 2. pixel pet (square-ish 640x480) original blob creature
P = 20; W, H = 32, 24
pet = Image.new("RGB", (W, H), (214, 232, 196)); d = ImageDraw.Draw(pet)
body = ["....######....", "..##########..", ".############.", "##############", "##############", "##############", "##############", ".############.", "..##########..", "..##..##..##.."]
ox, oy = 9, 7
for y, row in enumerate(body):
    for x, ch in enumerate(row):
        if ch == "#": pet.putpixel((ox+x, oy+y), (255, 160, 190))
for x, y in [(ox+4, oy+3), (ox+9, oy+3)]: pet.putpixel((x, y), (40, 30, 50))
for x, y in [(ox+3, oy+5), (ox+10, oy+5)]: pet.putpixel((x, y), (255, 110, 150))
for x in range(ox+6, ox+8): pet.putpixel((x, oy+5), (40, 30, 50))
for x, y in [(4, 4), (5, 3), (6, 4), (5, 5), (26, 5), (25, 6), (27, 6), (26, 7)]: pet.putpixel((x, y), (255, 255, 255))
heart = [".#.#.", "#####", "#####", ".###.", "..#.."]
for i in range(3):
    for y, row in enumerate(heart):
        for x, ch in enumerate(row):
            if ch == "#": pet.putpixel((2+i*6+x, 18+y), (230, 70, 110))
pet.resize((W*P, H*P), Image.NEAREST).save(OUT+"pixel-pet.png")

# 3. pixel game scene (wide 640x360)
W, H = 64, 36
g = Image.new("RGB", (W, H)); d = ImageDraw.Draw(g)
for y in range(H): d.line([(0, y), (W, y)], fill=(120+int(y*2.5), 170+int(y*1.5), 255))
for cx, cy in [(12, 7), (40, 5), (54, 11)]:
    d.rectangle([cx-4, cy, cx+4, cy+2], fill=(255,255,255)); d.rectangle([cx-2, cy-1, cx+2, cy], fill=(255,255,255))
d.rectangle([0, 28, W, H], fill=(110, 190, 90)); d.rectangle([0, 28, W, 28], fill=(80, 150, 60))
for x in range(0, W, 4): d.point((x, 30), fill=(90, 170, 70))
d.rectangle([20, 20, 27, 22], fill=(200, 120, 70)); d.rectangle([21, 19, 26, 19], fill=(230, 150, 90))
d.rectangle([44, 16, 51, 18], fill=(200, 120, 70))
for x, y in [(23, 15), (47, 11), (34, 22)]:
    for dx, dy in [(0,0),(1,0),(0,1),(1,1)]: d.point((x+dx, y+dy), fill=(255, 220, 60))
blob = [".###.", "#####", "#.#.#", "#####", "#.#.#"]
for y, row in enumerate(blob):
    for x, ch in enumerate(row):
        if ch == "#": g.putpixel((10+x, 23+y), (255, 150, 190))
g.putpixel((11, 25), (40,30,50)); g.putpixel((13, 25), (40,30,50))
for i in range(3):
    for y, row in enumerate(heart):
        for x, ch in enumerate(row):
            if ch == "#": g.putpixel((2+i*6+x, 2+y), (230, 70, 110))
g.resize((W*10, H*10), Image.NEAREST).save(OUT+"pixel-game.png")

# 4. phone wallpaper: night gradient + sparkles (portrait 480x600)
wp = grad(480, 600, (30, 26, 70), (120, 80, 170)).convert("RGBA"); d = ImageDraw.Draw(wp)
def sparkle(cx, cy, r, col):
    pts = []
    for i in range(8):
        rr = r if i % 2 == 0 else r*0.18; a = math.radians(-90 + i*45); pts.append((cx+rr*math.cos(a), cy+rr*math.sin(a)))
    d.polygon(pts, fill=col)
for _ in range(60):
    x, y = random.randint(0, 480), random.randint(0, 600); d.ellipse([x, y, x+3, y+3], fill=(255,255,255,random.randint(90,220)))
for cx, cy, r in [(110, 150, 40), (360, 260, 28), (200, 430, 34), (400, 500, 20), (80, 520, 16)]: sparkle(cx, cy, r, (255, 240, 200, 255))
wp.convert("RGB").save(OUT+"wallpaper.png")
print("ok")
