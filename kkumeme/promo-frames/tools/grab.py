import cv2, numpy as np, sys
from PIL import Image
from scipy import ndimage as ndi
src, out, x0, y0, x1, y1 = sys.argv[1], sys.argv[2], *map(int, sys.argv[3:7])
img = cv2.imread(src); mask = np.zeros(img.shape[:2], np.uint8)
bgd = np.zeros((1,65), np.float64); fgd = np.zeros((1,65), np.float64)
cv2.grabCut(img, mask, (x0, y0, x1-x0, y1-y0), bgd, fgd, 8, cv2.GC_INIT_WITH_RECT)
m = ((mask == 1) | (mask == 3))
lab, n = ndi.label(m); sizes = ndi.sum(m, lab, range(1, n+1)); m = lab == (1+int(np.argmax(sizes)))
m = ndi.binary_fill_holes(ndi.binary_closing(m, iterations=3))
a = ndi.gaussian_filter(m.astype(np.float32), 1.0)
rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB).astype(np.float32)
H, W = a.shape; t = int(min(x1-x0, y1-y0)*0.05); pad = t+8
A = np.pad(a, pad); RGB = np.pad(rgb, ((pad,pad),(pad,pad),(0,0)))
dist = ndi.distance_transform_edt(A < 0.5); border = np.clip(t+1-dist, 0, 1)
outA = np.maximum(A, border); outRGB = RGB*A[...,None] + 255*(1-A[...,None])
im = Image.fromarray(np.dstack([outRGB, outA*255]).clip(0,255).astype(np.uint8), "RGBA"); im = im.crop(im.getbbox()); im.save(out); print(im.size)
