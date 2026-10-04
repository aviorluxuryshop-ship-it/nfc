import cv2,sys,numpy as np,glob
fs=sys.argv[2:]
ims=[cv2.resize(cv2.imread(f),(360,640)) for f in fs]
for im,f in zip(ims,fs): cv2.putText(im,f.split('_')[-1][:-4],(8,630),0,0.7,(0,255,255),2)
while len(ims)%4: ims.append(np.zeros_like(ims[0]))
rows=[np.hstack(ims[i:i+4]) for i in range(0,len(ims),4)]
cv2.imwrite(sys.argv[1],np.vstack(rows),[cv2.IMWRITE_JPEG_QUALITY,85])
