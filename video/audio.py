# Synthesizes the ambient luxury score + sound design for the 36s film (no external assets).
import numpy as np, wave, sys
SR=44100; DUR=36.0; N=int(SR*DUR)
rng=np.random.default_rng(7)
t=np.arange(N)/SR
L=np.zeros(N); R=np.zeros(N)
def env(n,a,d,curve=3.0):
    x=np.arange(n)/SR; e=np.minimum(1,x/a)*np.exp(-x/d*curve); return e
def add(sig,at,pan=0.0,gain=1.0):
    i=int(at*SR); n=min(len(sig),N-i)
    if n<=0: return
    l=np.cos((pan+1)*np.pi/4); r=np.sin((pan+1)*np.pi/4)
    L[i:i+n]+=sig[:n]*gain*l; R[i:i+n]+=sig[:n]*gain*r
def mtof(m): return 440*2**((m-69)/12)
# ---- pad: slowly evolving chords (D minor 9 -> Bb maj7 -> Gm9 -> A sus) ----
chords=[[50,57,60,64,69],[46,53,58,62,69],[43,50,58,62,65],[45,52,57,64,67]]
def pad(notes,dur,fi=1.5,fo=2.0):
    n=int(dur*SR); x=np.arange(n)/SR; sig=np.zeros(n)
    for k,m in enumerate(notes):
        f=mtof(m)
        for det in (-0.07,0.0,0.09):
            ph=rng.uniform(0,6.28)
            sig+=np.sin(2*np.pi*f*(1+det*0.01)*x+ph+0.3*np.sin(2*np.pi*0.13*x+k))*(0.6/(1+0.15*k))
            sig+=0.25*np.sin(2*np.pi*2*f*(1+det*0.01)*x+ph)*(0.5)
    e=np.minimum(1,x/fi)*np.minimum(1,(dur-x)/fo)
    return sig*e
seg=9.0
for i in range(4):
    p=pad(chords[i],seg+3)
    add(p,i*seg-0.0,gain=0.055)
# sub bass swell
sub=np.sin(2*np.pi*mtof(26)*t)*np.clip(np.sin(np.pi*np.clip(t/DUR,0,1)),0,1)**0.7
L+=sub*0.10; R+=sub*0.10
# ---- bell plucks (FM) ----
def bell(m,dur=3.5):
    n=int(dur*SR); x=np.arange(n)/SR; f=mtof(m)
    mod=np.sin(2*np.pi*f*3.5*x)*np.exp(-x*5)*2.2
    return (np.sin(2*np.pi*f*x+mod)*0.7+np.sin(2*np.pi*f*2*x)*0.15)*np.exp(-x*1.7)
scale=[74,76,77,81,84,86,88]
starts=[0.9,4.55]+[4.8+i*3.7 for i in range(6)]+[27.0,31.2]
for k,s0 in enumerate(starts):
    for j,m in enumerate([scale[(k*2)%7],scale[(k*2+2)%7],scale[(k*2+4)%7]]):
        add(bell(m),s0+0.12*j,pan=(-0.5+0.5*j),gain=0.10 if j==0 else 0.06)
# arpeggio shimmer over step scenes
for i in range(0,int((27.0-4.8)/0.3)):
    tt=4.8+i*0.3; m=scale[(i*3)%7]-12*(i%2)
    add(bell(m,2.2),tt,pan=np.sin(i),gain=0.028)
# ---- risers (filtered noise) ----
def riser(dur,f0,f1):
    n=int(dur*SR); x=np.arange(n)/SR; nz=rng.standard_normal(n)
    # crude swept bandpass via time-varying sine modulation of noise
    fc=f0+(f1-f0)*(x/dur)**2; sig=nz*np.sin(2*np.pi*np.cumsum(fc)/SR)
    return sig*np.minimum(1,(x/dur)**2)*np.minimum(1,(dur-x)/0.05)
for s0,d in [(2.8,1.8),(26.0,1.0),(30.3,0.9)]:
    add(riser(d,300,5000),s0,gain=0.05)
# whoosh at each scene change
def whoosh(dur=0.9):
    n=int(dur*SR); x=np.arange(n)/SR; nz=rng.standard_normal(n)
    fc=200+4000*np.sin(np.pi*x/dur)**2; sig=nz*np.sin(2*np.pi*np.cumsum(fc)/SR)
    return sig*np.sin(np.pi*x/dur)**2
for s0 in starts[1:]:
    add(whoosh(),s0-0.15,pan=-0.3,gain=0.06)
# deep hits
def hit(dur=1.8,f=48):
    n=int(dur*SR); x=np.arange(n)/SR
    return np.sin(2*np.pi*(f+60*np.exp(-x*14))*x)*np.exp(-x*2.6)
for s0 in [4.55,27.0,31.2]:
    add(hit(),s0,gain=0.35)
add(hit(2.4,41),0.9,gain=0.25)
# soft ticks as each progress step lands
def tick():
    n=int(0.25*SR); x=np.arange(n)/SR
    return np.sin(2*np.pi*3000*x)*np.exp(-x*40)*0.5+np.sin(2*np.pi*1500*x)*np.exp(-x*30)*0.5
for i in range(6):
    add(tick(),4.8+i*3.7+0.55,gain=0.08)
# loop scene node pings
for k in range(6):
    add(bell(scale[k]+0,1.6),27.0+0.9+k*(2.7/6),pan=-0.6+0.24*k,gain=0.09)
# ---- reverb (synthetic IR) ----
irn=int(2.6*SR); ir=rng.standard_normal(irn)*np.exp(-np.arange(irn)/SR*2.1)
ir[:int(.02*SR)]*=np.linspace(0,1,int(.02*SR))
def rev(x,ir):
    n=len(x)+len(ir); F=1<<int(np.ceil(np.log2(n)))
    return np.fft.irfft(np.fft.rfft(x,F)*np.fft.rfft(ir,F),F)[:len(x)]
irl=ir; irr=np.roll(ir,97)*np.where(np.arange(irn)%2==0,1,0.9)
wl=rev(L,irl)*0.035; wr=rev(R,irr)*0.035
Lf=L*0.8+wl; Rf=R*0.8+wr
# fades
fi=np.clip(t/1.0,0,1); fo=np.clip((DUR-t)/2.0,0,1)
Lf*=fi*fo; Rf*=fi*fo
m=max(np.abs(Lf).max(),np.abs(Rf).max()); Lf=Lf/m*0.89; Rf=Rf/m*0.89
out=np.stack([Lf,Rf],1); pcm=(out*32767).astype('<i2')
with wave.open(sys.argv[1],'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok')
