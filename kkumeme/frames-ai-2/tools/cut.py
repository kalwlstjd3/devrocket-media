import sys, numpy as np
from PIL import Image, ImageFilter
from collections import deque
src,dst=sys.argv[1],sys.argv[2]; bgtol=int(sys.argv[3]) if len(sys.argv)>3 else 28
im=Image.open(src).convert("RGB"); a=np.asarray(im).astype(np.int16); h,w,_=a.shape
bg_ref=np.median(np.concatenate([a[0],a[-1],a[:,0],a[:,-1]]),axis=0)
diff=np.abs(a-bg_ref).max(axis=2)
near=diff<bgtol
# flood fill background from border
bg=np.zeros((h,w),bool); q=deque()
for x in range(w):
  for y in (0,h-1):
    if near[y,x] and not bg[y,x]: bg[y,x]=True; q.append((y,x))
for y in range(h):
  for x in (0,w-1):
    if near[y,x] and not bg[y,x]: bg[y,x]=True; q.append((y,x))
while q:
  y,x=q.popleft()
  for dy,dx in ((1,0),(-1,0),(0,1),(0,-1)):
    ny,nx=y+dy,x+dx
    if 0<=ny<h and 0<=nx<w and not bg[ny,nx] and near[ny,nx]: bg[ny,nx]=True; q.append((ny,nx))
r,g,b=a[...,0],a[...,1],a[...,2]
green=(g>150)&(g-r>70)&(g-b>70)
alpha=np.full((h,w),255,np.uint8); alpha[bg]=0; alpha[green]=0
# soften edges: 1px feather
am=Image.fromarray(alpha).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
alpha=np.minimum(alpha,np.asarray(am))
# despill green on remaining edge pixels
out=a.copy(); spill=(g>np.maximum(r,b))&(alpha>0)
out[...,1]=np.where(spill,np.maximum(r,b),g)
rgba=np.dstack([out.clip(0,255).astype(np.uint8),alpha])
img=Image.fromarray(rgba,"RGBA"); bb=img.getbbox(); img=img.crop((max(bb[0]-4,0),max(bb[1]-4,0),min(bb[2]+4,w),min(bb[3]+4,h)))
s=1024/max(img.size)
if s<1: img=img.resize((round(img.width*s),round(img.height*s)),Image.LANCZOS)
img.save(dst); print(img.size, "green px",int(green.sum()), "bg px",int(bg.sum()))
