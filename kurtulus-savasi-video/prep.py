import cv2, numpy as np, json, pickle
from shapely.geometry import shape, box, mapping
from shapely.ops import unary_union
cv2.setNumThreads(4)
LON0,LON1,LAT0,LAT1=5.0,56.0,20.0,58.0
PPD=240; KX=np.cos(np.radians(38.5))
img=cv2.imread('data/bm.jpg')  # lon 0..90, lat 90..0
x0,x1=int(LON0*PPD),int(LON1*PPD); y0,y1=int((90-LAT1)*PPD),int((90-LAT0)*PPD)
c=img[y0:y1,x0:x1].copy(); del img
c=cv2.resize(c,(int(c.shape[1]*KX),c.shape[0]),interpolation=cv2.INTER_AREA)
def gradef(f):
    b,g,r=f[...,0],f[...,1],f[...,2]
    lum=0.3*r+0.59*g+0.11*b
    water=np.clip((b-r)*5-0.15,0,1)
    water=cv2.GaussianBlur(water,(0,0),1.5)
    land=f*0.8+lum[...,None]*0.2
    land=np.clip((land-0.02)*1.18,0,1)*np.array([0.9,0.98,1.06],np.float32)
    sea=np.clip(f*np.array([1.0,0.95,0.8],np.float32)*0.85,0,1)
    out=land*(1-water[...,None])+sea*water[...,None]
    bl=cv2.GaussianBlur(out,(0,0),3)
    return np.clip(out+(out-bl)*0.8,0,1)
res=np.zeros_like(c)
step=800;pad=24
for y in range(0,c.shape[0],step):
    y0p=max(0,y-pad); y1p=min(c.shape[0],y+step+pad)
    o=gradef(c[y0p:y1p].astype(np.float32)/255)
    res[y:y+step]=(o[y-y0p:y-y0p+min(step,c.shape[0]-y)]*255).astype(np.uint8)
del c
out=res
cv2.imwrite('data/base.png',out)
cv2.imwrite('data/base_half.png',cv2.resize(out,None,fx=0.5,fy=0.5,interpolation=cv2.INTER_AREA))
cv2.imwrite('data/base_q.png',cv2.resize(out,None,fx=0.25,fy=0.25,interpolation=cv2.INTER_AREA))
print(out.shape)
# vectors
bb=box(LON0,LAT0,LON1,LAT1)
def load(fn,simp=0.004):
    gs=[]
    for ft in json.load(open(fn))['features']:
        g=shape(ft['geometry'])
        if g.intersects(bb): gs.append((ft['properties'],g.intersection(bb).simplify(simp)))
    return gs
landg=unary_union([g for p,g in load('data/land.geojson',0.003)])
lakes=[g for p,g in load('data/lakes.geojson',0.003)]
rivers={}
for p,g in load('data/rivers.geojson',0.003):
    n=p.get('name') or ''
    rivers.setdefault(n,[]).append(g)
countries={p['ADMIN']:g for p,g in load('data/countries.geojson',0.003)}
pickle.dump(dict(land=landg,lakes=lakes,rivers=rivers,countries=countries,shape=out.shape,KX=KX,PPD=PPD,LON0=LON0,LAT1=LAT1),open('data/geo.pkl','wb'))
print(sorted(rivers)[:80]); print(sorted(countries))
