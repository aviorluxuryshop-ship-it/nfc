# Modern, voice-over-friendly score + UI sound design for the 34s social-media-agency film. Pure numpy, no assets.
import numpy as np, wave, sys
SR=44100; DUR=34.0; N=int(SR*DUR); BPM=120; B=60/BPM
rng=np.random.default_rng(11)
t=np.arange(N)/SR
L=np.zeros(N); R=np.zeros(N)
def add(sig,at,pan=0.0,gain=1.0):
    i=int(at*SR); n=min(len(sig),N-i)
    if n<=0 or i<0: return
    l=np.cos((pan+1)*np.pi/4); r=np.sin((pan+1)*np.pi/4)
    L[i:i+n]+=sig[:n]*gain*l; R[i:i+n]+=sig[:n]*gain*r
def mtof(m): return 440*2**((m-69)/12)
def X(d): return np.arange(int(d*SR))/SR
def lp_noise(n,fc):  # noise lowpassed in frequency domain
    nz=rng.standard_normal(n); F=np.fft.rfft(nz); f=np.fft.rfftfreq(n,1/SR); F*=1/(1+(f/fc)**4); return np.fft.irfft(F,n)
# ---------- drums ----------
def kick():
    x=X(0.45); f=48+110*np.exp(-x*28); ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*np.exp(-x*7.5)*1.0+np.sin(2*np.pi*3500*x)*np.exp(-x*300)*0.1
def hat(open_=False):
    x=X(0.18 if open_ else 0.06); nz=rng.standard_normal(len(x)); nz=np.diff(nz,prepend=0)
    return nz*np.exp(-x*(18 if open_ else 70))
def clap():
    x=X(0.25); nz=lp_noise(len(x),4500)+0.3*rng.standard_normal(len(x))*0; env=np.exp(-x*22)*(1+0.9*(np.sin(2*np.pi*70*x)>0))
    return np.diff(nz,prepend=0)*env*1.6
# ---------- tonal ----------
def pluck(m,d=0.5,bright=1.0):
    x=X(d); f=mtof(m); s=np.sin(2*np.pi*f*x)+0.35*np.sin(2*np.pi*2*f*x)*np.exp(-x*9*bright)+0.15*np.sin(2*np.pi*3*f*x)*np.exp(-x*14)
    return s*np.exp(-x*7)*np.minimum(1,x/0.003)
def bass(m,d=0.45):
    x=X(d); f=mtof(m); s=np.sin(2*np.pi*f*x)+0.25*np.sin(2*np.pi*2*f*x); return s*np.exp(-x*3.2)*np.minimum(1,x/0.004)
def bell(m,d=1.6):
    x=X(d); f=mtof(m); mod=np.sin(2*np.pi*f*3.5*x)*np.exp(-x*6)*1.8
    return (np.sin(2*np.pi*f*x+mod)*0.7+0.12*np.sin(2*np.pi*2*f*x))*np.exp(-x*2.6)
def pad(notes,d):
    x=X(d); s=np.zeros(len(x))
    for k,m in enumerate(notes):
        f=mtof(m)
        for det in (-0.12,0.0,0.10):
            s+=np.sin(2*np.pi*f*(1+det*0.01)*x+rng.uniform(0,6.28)+0.4*np.sin(2*np.pi*0.2*x+k))/(1+0.12*k)
    return s*np.minimum(1,x/0.6)*np.minimum(1,(d-x)/0.8)
# ---------- arrangement ----------
# progression (2 bars each, 120bpm => 4s): Dm9 | Bbmaj7 | Gm9 | A7sus | Dm9 | Bbmaj7 | Gm9 | (outro) Dmaj9
prog=[[50,57,60,64,69],[46,53,57,62,69],[43,50,58,62,65],[45,52,55,60,64],[50,57,60,64,69],[46,53,57,62,69],[43,50,58,62,65],[50,57,61,64,69]]
roots=[38,34,31,33,38,34,31,38]
duck=np.ones(N)
def add_duck(at,depth=0.45,rel=0.28):
    i=int(at*SR); n=int(rel*SR); 
    if i+n>N: n=N-i
    d=1-depth*np.exp(-np.arange(n)/SR/0.09); duck[i:i+n]=np.minimum(duck[i:i+n],d)
padL=np.zeros(N); padR=np.zeros(N)
for k,ch in enumerate(prog):
    st=k*4.0; d=4.6 if k<7 else 6.0
    p=pad(ch,d)
    i=int(st*SR); n=min(len(p),N-i)
    padL[i:i+n]+=p[:n]; padR[i:i+n]+=np.roll(p,37)[:n]
# kick pattern from step 1 (t=4) to 28 : four on the floor; hook gets soft heartbeat
beats=[]
for k in range(int(4/B),int(28/B)): beats.append(k*B)
for tt in beats:
    add(kick(),tt,gain=0.55); add_duck(tt)
for tt in (0.0,1.0,2.0,3.0,3.5): add(kick(),tt,gain=0.25) if tt>=1.0 else None
# hats (offbeat) + open hat + claps on 2,4 (soft)
for k in range(int(4/B),int(28/B)):
    tt=k*B
    add(hat(),tt+B/2,pan=0.25,gain=0.07)
    if k%4==3: add(hat(True),tt+B/2,pan=-0.2,gain=0.06)
    if k%2==1 and tt>=8: add(clap(),tt,gain=0.10)
# bass line (8ths on root with octave jumps)
for k,r in enumerate(roots):
    st=k*4.0
    if st<4 or st>=28: continue
    for j in range(8):
        tt=st+j*B/2*1.0
        if j in (0,3,4,7): add(bass(r+(12 if j==7 else 0),0.4),tt,gain=0.30)
# arpeggio plucks (16th feel on 8ths)
for k,ch in enumerate(prog):
    st=k*4.0
    if st<4 or st>=28: continue
    seq=[ch[1],ch[2],ch[3],ch[4],ch[3],ch[2],ch[1],ch[3]]
    for j in range(16):
        m=seq[j%8]+12
        add(pluck(m,0.35),st+j*B/4*2,pan=np.sin(j)*0.5,gain=0.050)
# hook: airy bells + riser
for j,m in enumerate([81,84,88,86]):
    add(bell(m,2.2),0.35+j*0.45,pan=-0.4+0.3*j,gain=0.07)
def riser(d,f0,f1):
    x=X(d); nz=rng.standard_normal(len(x)); fc=f0+(f1-f0)*(x/d)**2
    return nz*np.sin(2*np.pi*np.cumsum(fc)/SR)*(x/d)**2
add(riser(1.6,200,6000),2.4,gain=0.06)
# transitions: whoosh + impact at each scene start
def whoosh(d=0.7):
    x=X(d); nz=rng.standard_normal(len(x)); fc=300+5000*np.sin(np.pi*x/d)**2
    return nz*np.sin(2*np.pi*np.cumsum(fc)/SR)*np.sin(np.pi*x/d)**2
def impact():
    x=X(1.4); return np.sin(2*np.pi*(42+80*np.exp(-x*12))*x)*np.exp(-x*3.2)+0.2*lp_noise(len(x),900)*np.exp(-x*6)
for k in range(7):
    s0=4.0+k*4.0
    add(whoosh(),s0-0.35,pan=-0.3,gain=0.07); add(impact(),s0,gain=0.38)
    add(bell(mtof(0)*0+[86,88,84,86,88,91,93][k],1.4),s0+0.02,pan=0.2,gain=0.07)
# ---------- UI sounds ----------
def ping(f=1800,d=0.18):
    x=X(d); return (np.sin(2*np.pi*f*x)+0.4*np.sin(2*np.pi*2*f*x))*np.exp(-x*22)
def popsnd(f=420):
    x=X(0.14); return np.sin(2*np.pi*(f+500*np.exp(-x*40))*x)*np.exp(-x*28)
def tick():
    x=X(0.05); return np.sin(2*np.pi*4200*x)*np.exp(-x*140)
S=lambda i:4.0+4.0*i
# S1 bubbles + checks
add(popsnd(520),S(0)+.35,pan=-.4,gain=.22); add(popsnd(640),S(0)+.95,pan=.4,gain=.22)
for j in range(5): add(ping(1500+120*j),S(0)+1.5+j*.38,pan=-.2+.1*j,gain=.10)
# S2 calendar pops
for j in range(15): add(popsnd(500+25*(j%5)),S(1)+.95+j*.13,pan=np.sin(j)*.5,gain=.10)
# S3 focus lock + clips
add(ping(2400,.3),S(2)+2.0,gain=.12)
for j in range(7): add(whoosh(.25),S(2)+.85+j*.14,pan=.3,gain=.03)
# S4 heart + comments
add(popsnd(300),S(3)+1.2,gain=.25)
for j,tm in enumerate([1.4,1.9,2.4]): add(popsnd(700+80*j),S(3)+tm,pan=-.3+.3*j,gain=.20)
for j in range(7): add(ping(1900+90*j,.25),S(3)+1.3+j*.32,pan=np.sin(j)*.6,gain=.05)
# S5 slider + reach counter ticks
add(whoosh(1.0),S(4)+.9,gain=.04)
for j in range(24): add(tick(),S(4)+2.0+j*.0625,pan=.2,gain=.06)
# S6 kpis count + final sparkle
for j in range(30): add(tick(),S(5)+.7+j*.05,pan=-.2,gain=.045)
for j in range(8): add(bell([84,88,91,93,96,93,91,88][j],1.0),S(5)+3.0+j*.06,pan=-.4+.1*j,gain=.05)
# outro: big final
add(impact(),28.0,gain=.45)
for j,m in enumerate([74,78,81,86,90]): add(bell(m,3.5),28.2+j*.12,pan=-.4+.2*j,gain=.08)
add(popsnd(500),28+1.5,gain=.2); add(ping(2200,.4),28+2.1,gain=.1)
# ---------- mix ----------
irn=int(1.8*SR); ir=rng.standard_normal(irn)*np.exp(-np.arange(irn)/SR*2.8)
def rev(x):
    n=len(x)+irn; F=1<<int(np.ceil(np.log2(n))); return np.fft.irfft(np.fft.rfft(x,F)*np.fft.rfft(ir,F),F)[:len(x)]
padmix_l=padL*duck*0.050; padmix_r=padR*duck*0.050
sub=np.sin(2*np.pi*mtof(26)*t)*np.clip(np.sin(np.pi*t/DUR),0,1)*0.05
Lm=L+padmix_l+sub; Rm=R+padmix_r+sub
wl=rev(Lm)*0.030; wr=rev(np.roll(Rm,53))*0.030
Lf=Lm*0.85+wl; Rf=Rm*0.85+wr
fi=np.clip(t/0.6,0,1); fo=np.clip((DUR-t)/1.8,0,1); Lf*=fi*fo; Rf*=fi*fo
# gentle low-cut to leave room for voice at 150-3k: attenuate 250-2500 slightly via FFT shelf
def voice_pocket(x):
    F=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); g=1-0.35*np.exp(-((np.log(np.maximum(f,1)/900))**2)/(2*0.55**2)); return np.fft.irfft(F*g,len(x))
Lf=voice_pocket(Lf); Rf=voice_pocket(Rf)
m=max(np.abs(Lf).max(),np.abs(Rf).max()); Lf=Lf/m*0.85; Rf=Rf/m*0.85
pcm=(np.stack([Lf,Rf],1)*32767).astype('<i2')
with wave.open(sys.argv[1],'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok')
