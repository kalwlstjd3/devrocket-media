import numpy as np, sys
from PIL import Image
from scipy import ndimage as ndi
src, out = sys.argv[1], sys.argv[2]
crop_bottom = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
im = Image.open(src).convert("RGB"); a = np.asarray(im).astype(np.float32)
r, g, b = a[...,0], a[...,1], a[...,2]
# greenness: how much g exceeds max(r,b)
gx = g - np.maximum(r, b)
hsv = np.asarray(im.convert("HSV")).astype(np.float32)
hue, sat = hsv[...,0], hsv[...,1]
bg = (gx > 30) & (hue > 55) & (hue < 120) & (sat > 90)
# soft alpha on edge band
bg = ndi.binary_opening(bg, iterations=1)
alpha = np.where(bg, 0.0, 1.0)
edge = ndi.binary_dilation(bg, iterations=2) & ~bg
alpha[edge] = np.clip((60 - gx[edge]) / 40, 0.35, 1)
# despill
spill = np.maximum(g - np.maximum(r, b), 0); a[...,1] = g - spill * 0.95
H, W = alpha.shape
if crop_bottom < 1: alpha[int(H*crop_bottom):] = 0
# largest component only
lab, n = ndi.label(alpha > 0.5); sizes = ndi.sum(np.ones_like(alpha), lab, range(1, n+1)); keep = lab == (1 + int(np.argmax(sizes)))
alpha = alpha * ndi.binary_dilation(keep, iterations=2)
# white die-cut border
t = int(min(H, W) * 0.035)
pad = t + 8
A = np.pad(alpha, pad); RGB = np.pad(a, ((pad,pad),(pad,pad),(0,0)))
dist = ndi.distance_transform_edt(A < 0.5)
border = np.clip(t + 1 - dist, 0, 1)
outA = np.maximum(A, border)
outRGB = RGB * A[...,None] + 255 * (1 - A[...,None])
img = Image.fromarray(np.dstack([outRGB, outA*255]).clip(0,255).astype(np.uint8), "RGBA")
img = img.crop(img.getbbox())
img.save(out); print(out, img.size)
