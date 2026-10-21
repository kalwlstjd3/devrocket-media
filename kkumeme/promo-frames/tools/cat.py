from PIL import Image, ImageDraw
import math
S = 4; W = H = 300*S
im = Image.new("RGBA", (W, H), (0,0,0,0)); d = ImageDraw.Draw(im)
O = (59, 38, 24); OR = (244, 167, 92); CR = (255, 240, 222); PK = (255, 160, 170)
cx, cy, R = W//2, int(H*0.56), int(W*0.34)
def ear(sign):
    return [(cx+sign*R*0.95, cy-R*0.25), (cx+sign*R*0.78, cy-R*1.28), (cx+sign*R*0.18, cy-R*0.82)]
def headshape(d, grow, fill):
    for s in (-1, 1): d.polygon([(x+(x-cx)*0+ (grow if x>cx else -grow), y-grow) for x,y in ear(s)], fill=fill)
    d.ellipse([cx-R*1.05-grow, cy-R*0.9-grow, cx+R*1.05+grow, cy+R*0.85+grow], fill=fill)
headshape(d, 5*S, O)                  # outline
headshape(d, 0, OR)
# inner ears
for s in (-1, 1):
    p = ear(s); c0 = ((p[0][0]+p[1][0]+p[2][0])/3, (p[0][1]+p[1][1]+p[2][1])/3)
    d.polygon([(c0[0]+(x-c0[0])*0.5, c0[1]+(y-c0[1])*0.5) for x,y in p], fill=PK)
# muzzle cream
d.ellipse([cx-R*0.62, cy-R*0.05, cx+R*0.62, cy+R*0.78], fill=CR)
# stripes on forehead
for dx in (-0.22, 0, 0.22):
    d.line([cx+R*dx, cy-R*0.86, cx+R*dx*0.8, cy-R*0.56], fill=O, width=7*S)
# eyes (closed happy arcs)
for s in (-1, 1):
    ex = cx+s*R*0.42; ey = cy+R*0.02
    d.arc([ex-R*0.17, ey-R*0.12, ex+R*0.17, ey+R*0.16], 200, 340, fill=O, width=8*S)
# blush
for s in (-1, 1): d.ellipse([cx+s*R*0.66-R*0.14, cy+R*0.22-R*0.08, cx+s*R*0.66+R*0.14, cy+R*0.22+R*0.08], fill=(255, 140, 150))
# nose + mouth
d.polygon([(cx-R*0.08, cy+R*0.2), (cx+R*0.08, cy+R*0.2), (cx, cy+R*0.3)], fill=(230, 100, 120))
d.arc([cx-R*0.18, cy+R*0.22, cx, cy+R*0.42], 0, 160, fill=O, width=6*S)
d.arc([cx, cy+R*0.22, cx+R*0.18, cy+R*0.42], 20, 180, fill=O, width=6*S)
# whiskers
for s in (-1, 1):
    for k, dy in enumerate((0.3, 0.42)):
        d.line([cx+s*R*0.62, cy+R*dy, cx+s*R*1.12, cy+R*(dy-0.08+0.12*k)], fill=O, width=4*S)
import numpy as np
from scipy import ndimage as ndi
A = np.asarray(im.getchannel("A")) > 127; dist = ndi.distance_transform_edt(~A); ring = (dist <= 24*S) & ~A
base = Image.new("RGBA", im.size, (0,0,0,0)); m = Image.fromarray((ring*255).astype(np.uint8)).filter(__import__("PIL.ImageFilter",fromlist=["x"]).GaussianBlur(2))
white = Image.new("RGBA", im.size, (252,250,246,255)); base.paste(white, (0,0), m); base.alpha_composite(im); im = base
im = im.crop(im.getbbox()).resize((im.crop(im.getbbox()).width//S, im.crop(im.getbbox()).height//S), Image.LANCZOS)
im.save("work/cat.png"); print(im.size)
bg = Image.new("RGBA", im.size, (230, 225, 215, 255)); bg.alpha_composite(im); bg.convert("RGB").save("/tmp/claude-0/cat.jpg")
