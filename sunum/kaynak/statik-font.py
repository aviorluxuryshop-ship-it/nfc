"""Archivo değişken fontundan sunumda kullanılan statik örnekleri üretir.

Chromium değişken fontları PDF'e Type 3 olarak gömer; statik örnekler gerçek
TrueType olarak gömülür (her görüntüleyicide net görünür, metin kopyalanabilir).
Kullanım: python3 statik-font.py   (fonttools + brotli gerekir)
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

here = Path(__file__).parent
subsets = {  # Next.js'in sitede kullandığı Archivo alt kümeleri
    'latin': here / 'fonts/21ca8f3f56c22ca2-s.p.14a9xpaqsbppk.woff2',
    'latin-ext': here / 'fonts/4ae66b896b591e96-s.p.02aqyp7acl16b.woff2',
}
out = here / 'fonts/static'
out.mkdir(parents=True, exist_ok=True)
for wdth in (100, 125):
    for wght in (400, 500, 600):
        for name, src in subsets.items():
            font = instancer.instantiateVariableFont(TTFont(src), {'wght': wght, 'wdth': wdth})
            ps = f'Archivo-W{wght}-S{wdth}'
            for rec in font['name'].names:
                if rec.nameID in (4, 6):
                    rec.string = ps if rec.nameID == 6 else ps.replace('-', ' ')
            font.flavor = 'woff2'
            font.save(out / f'archivo-{wght}-{wdth}-{name}.woff2')
print('ok')
