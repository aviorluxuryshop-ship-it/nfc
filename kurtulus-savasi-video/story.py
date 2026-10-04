# -*- coding: utf-8 -*-
"""Kurtuluş Savaşı — senaryo / zaman çizelgesi."""
import math, os
from engine import *
from shapely.geometry import Polygon, LineString, Point

# ------------------------------------------------------------------ colors
TR = hexc('#c8102e')
GR = hexc('#1f5fbf')
UK = hexc('#7a3fa0')      # İtilaf / İngiliz (mor)
FR = hexc('#1d8f9c')      # Fransız (camgöbeği)
IT = hexc('#3f9d3a')      # İtalyan (yeşil)
AM = hexc('#e07b1a')      # Ermeni (turuncu)
KU = hexc('#b9a04a')      # Sevr: öngörülen özerk bölge
GOLD = (1.0, 0.82, 0.38)

# ------------------------------------------------------------------ places
C = dict(
    ISTANBUL=(28.98, 41.01), ANKARA=(32.86, 39.93), IZMIR=(27.14, 38.42), SAMSUN=(36.33, 41.29),
    HAVZA=(35.66, 40.97), AMASYA=(35.83, 40.65), TOKAT=(36.55, 40.31), SIVAS=(37.02, 39.75),
    ERZINCAN=(39.49, 39.75), ERZURUM=(41.27, 39.90), KAYSERI=(35.49, 38.72), KIRSEHIR=(34.16, 39.15),
    BURSA=(29.06, 40.19), ESKISEHIR=(30.52, 39.78), KUTAHYA=(29.98, 39.42), AFYON=(30.54, 38.76),
    USAK=(29.41, 38.68), POLATLI=(32.15, 39.58), BILECIK=(29.98, 40.14), INONU=(30.14, 39.82),
    DUMLUPINAR=(29.98, 38.85), KOCATEPE=(30.43, 38.66), MANISA=(27.43, 38.61), AYDIN=(27.85, 37.85),
    AYVALIK=(26.69, 39.32), ODEMIS=(27.97, 38.23), EDIRNE=(26.56, 41.68), CANAKKALE=(26.41, 40.15),
    IZMIT=(29.92, 40.77), MUDANYA=(28.88, 40.38), ANTALYA=(30.71, 36.89), ADANA=(35.32, 37.00),
    MARAS=(36.94, 37.58), ANTEP=(37.38, 37.07), URFA=(38.79, 37.16), KARS=(43.10, 40.60),
    SARIKAMIS=(42.59, 40.33), GUMRU=(43.85, 40.79), TRABZON=(39.72, 41.00), KONYA=(32.49, 37.87),
    MONDROS=(25.27, 39.87), MERSIN=(34.63, 36.80), ANTAKYA=(36.16, 36.20), BALIKESIR=(27.88, 39.65),
    DUATEPE=(32.17, 39.50), ALIHANLAR=(29.86, 38.93), SALIHLI=(28.14, 38.48), ERDEK=(27.79, 40.40),
)

# ------------------------------------------------------------------ geometry helpers
TURKEY_AM = TURKEY.union(ARMENIA)


def clipT(p):
    return p.intersection(TURKEY)


HATAY = Polygon([(35.70, 36.86), (36.05, 37.03), (36.45, 36.97), (36.72, 36.62), (36.72, 36.20), (36.40, 35.78), (35.70, 35.78)])

ISTANBUL_Z = LineString([(28.75, 40.98), (29.0, 41.02), (29.08, 41.2)]).buffer(0.16).union(Point(29.15, 40.92).buffer(0.12))
STRAITS_Z = LineString([(26.18, 40.0), (26.4, 40.15), (26.68, 40.42)]).buffer(0.22)
ALLIED = clipT(ISTANBUL_Z.union(STRAITS_Z))
THRACE = clipT(Polygon([(25.4, 40.3), (25.4, 42.2), (28.35, 42.2), (28.35, 40.9), (27.0, 40.66), (26.85, 40.66), (26.4, 40.3)]))

FR0 = clipT(Polygon([(33.6, 35.6), (33.9, 36.3), (34.3, 36.95), (35.0, 37.4), (36.0, 37.78), (36.9, 37.92), (37.6, 37.55),
                     (38.4, 37.62), (39.3, 37.52), (39.7, 37.1), (39.4, 36.4), (36.6, 35.4)]))
FR1 = clipT(Polygon([(33.6, 35.6), (33.9, 36.3), (34.3, 36.95), (35.0, 37.32), (36.1, 37.33), (36.8, 37.25), (37.6, 37.22),
                     (38.05, 36.95), (38.0, 36.4), (36.6, 35.4)]))
FR2 = clipT(HATAY)
IT0 = clipT(Polygon([(27.2, 37.78), (27.9, 37.58), (28.6, 37.33), (29.4, 37.22), (30.3, 37.52), (31.2, 37.25), (31.95, 36.62),
                     (32.1, 35.6), (26.8, 35.6), (26.8, 37.6)]))

# Sevr (yaklaşık)
SV_GR = clipT(Polygon([(26.3, 39.45), (26.7, 39.4), (27.3, 39.25), (27.9, 38.95), (28.35, 38.62), (28.42, 38.3), (28.05, 37.92),
                       (27.55, 37.66), (27.2, 37.58), (26.0, 37.6), (26.0, 39.45)])).union(THRACE)
SV_ST = clipT(Polygon([(26.0, 39.9), (26.0, 40.75), (27.0, 40.75), (27.0, 41.0), (28.35, 41.0), (28.35, 41.4), (29.95, 41.4),
                       (29.95, 40.35), (28.0, 40.15), (26.9, 39.95)]))
SV_IT = clipT(Polygon([(27.2, 37.58), (28.05, 37.92), (28.42, 38.3), (29.5, 38.4), (30.7, 38.5), (32.2, 38.3), (33.6, 37.7),
                       (34.0, 36.9), (33.8, 35.8), (27.0, 35.8)]))
SV_FR = clipT(Polygon([(33.8, 35.8), (34.0, 36.9), (34.6, 37.8), (35.8, 38.4), (37.6, 38.6), (38.9, 38.2), (39.8, 37.8),
                       (40.6, 37.4), (40.6, 36.0), (36.0, 35.4)]))
SV_KU = clipT(Polygon([(38.9, 38.2), (39.6, 38.75), (40.6, 38.95), (41.8, 38.85), (43.0, 38.45), (44.4, 37.6), (44.4, 37.0),
                       (42.0, 37.05), (40.6, 37.4), (39.8, 37.8)]))
SV_AM = Polygon([(38.75, 41.2), (38.85, 40.55), (39.3, 39.85), (40.3, 39.45), (41.6, 38.85), (42.8, 38.5), (43.4, 38.45),
                 (44.2, 38.6), (44.9, 39.4), (46.0, 39.6), (46.0, 41.3), (41.5, 41.6)]).intersection(TURKEY_AM)
SV_ALL = unary_union([SV_GR, SV_ST, SV_IT, SV_FR, SV_KU, SV_AM])
SV_TR = TURKEY.difference(SV_ALL.buffer(0.01))
LAUSANNE = TURKEY.difference(HATAY.buffer(0.005))

# ------------------------------------------------------------------ timeline builder
LAYERS = []      # (t0, t1, fn(ctx, v, t))
CAM = []         # (t, lon, lat, span, arc)
DATES = []       # (t, text)
CAPS = []        # (t0, t1, title, body)
CHAPTERS = []    # (t0, t1, num, title)
QUOTES = []      # (t0, t1, text, who)
PHOTOS = []      # (t0, t1, file, caption, (x0,y0,x1,y1) pan in rel coords, zoom0, zoom1)
CLOUDS = []      # (t, amount)
STAMPS = []      # (t0, t1, text, x, y, rot)
TITLES = []      # (t0, t1, kind)


def L(t0, t1):
    def deco(fn):
        LAYERS.append((t0, t1, fn))
        return fn
    return deco


def cam(t, lon, lat, span, arc=0.0):
    CAM.append((t, lon, lat, span, arc))


def camc(t, name, span, arc=0.0, dx=0.0, dy=0.0):
    lon, lat = C[name]
    cam(t, lon + dx, lat + dy, span, arc)


def date(t, s):
    DATES.append((t, s))


def cap(t0, t1, title, body=''):
    CAPS.append((t0, t1, title, body))


def photo(t0, t1, f, caption, pan=(0.0, 0.0, 1.0, 0.0), z=(1.0, 1.12)):
    PHOTOS.append((t0, t1, f, caption, pan, z))


# ------------------------------------------------------------------ green zone (Turkish national) & fronts
# Batı cephesi: Yunan işgal alanı (kuzeyden güneye 12 nokta)
K0 = [(26.55, 38.75), (26.8, 38.72), (26.95, 38.66), (27.08, 38.6), (27.22, 38.55), (27.32, 38.47), (27.36, 38.38),
      (27.3, 38.3), (27.18, 38.24), (27.0, 38.2), (26.75, 38.18), (26.4, 38.15)]
K1 = [(26.75, 39.45), (27.25, 39.25), (27.6, 39.05), (27.95, 38.85), (28.15, 38.58), (28.25, 38.3), (28.15, 38.05),
      (27.95, 37.88), (27.75, 37.72), (27.5, 37.62), (27.32, 37.56), (27.15, 37.5)]
K2 = [(29.95, 40.85), (29.65, 40.35), (29.55, 40.05), (29.35, 39.75), (29.45, 39.35), (29.65, 38.9), (29.45, 38.5),
      (29.05, 38.2), (28.6, 37.95), (28.2, 37.75), (27.75, 37.6), (27.25, 37.52)]
K3 = [(29.75, 40.55), (29.6, 40.3), (29.55, 40.05), (29.35, 39.75), (29.45, 39.35), (29.65, 38.9), (29.45, 38.5),
      (29.05, 38.2), (28.6, 37.95), (28.2, 37.75), (27.75, 37.6), (27.25, 37.52)]
K4 = [(30.2, 40.62), (30.45, 40.15), (30.95, 39.85), (31.45, 39.62), (31.55, 39.3), (31.0, 38.95), (30.62, 38.76), (30.35, 38.72), (29.9, 38.55), (29.3, 38.2), (28.5, 37.8), (27.25, 37.52)]
K5 = [(30.4, 40.62), (30.95, 40.15), (31.75, 39.92), (32.18, 39.62), (32.1, 39.25), (31.3, 38.95), (30.62, 38.76), (30.35, 38.72), (29.9, 38.55), (29.3, 38.2), (28.5, 37.8), (27.25, 37.52)]
K6 = [(30.05, 40.55), (30.35, 40.12), (30.62, 39.88), (30.82, 39.7), (30.78, 39.3), (30.7, 38.95), (30.62, 38.76), (30.35, 38.72), (29.9, 38.55), (29.3, 38.2), (28.5, 37.8), (27.25, 37.52)]
K7 = [(29.9, 40.45), (30.1, 40.05), (30.15, 39.7), (29.95, 39.3), (29.7, 39.0), (29.35, 38.7), (29.0, 38.4),
      (28.6, 38.1), (28.25, 37.85), (27.95, 37.68), (27.6, 37.58), (27.25, 37.52)]
K8 = [(29.0, 40.42), (29.1, 40.05), (28.6, 39.55), (28.2, 39.15), (27.85, 38.8), (27.55, 38.55), (27.3, 38.35),
      (27.1, 38.15), (26.9, 37.95), (26.7, 37.8), (26.5, 37.65), (26.3, 37.55)]
K9 = [(26.0, 40.42), (25.9, 40.05), (25.8, 39.55), (25.7, 39.15), (25.6, 38.8), (25.5, 38.55), (25.4, 38.35),
      (25.3, 38.15), (25.2, 37.95), (25.1, 37.8), (25.0, 37.65), (24.9, 37.55)]

E0 = [(42.55, 41.25), (42.45, 40.8), (42.4, 40.35), (42.6, 40.05), (43.0, 39.85), (43.5, 39.6), (44.0, 39.45), (44.4, 39.35)]
E1 = [(43.3, 41.25), (43.35, 40.9), (43.45, 40.7), (43.6, 40.4), (43.7, 40.1), (44.0, 39.8), (44.3, 39.6), (44.6, 39.45)]
E2 = [(43.45, 41.25), (43.6, 40.95), (43.72, 40.7), (43.62, 40.45), (43.62, 40.2), (44.0, 40.0), (44.6, 39.8), (44.8, 39.65)]

WEST_KEYS = []
EAST_KEYS = []


def west_greek(t):
    if t < WEST_KEYS[0][0]:
        return None
    pts = interp_keys(WEST_KEYS, t)
    return front_poly(pts).intersection(TURKEY)


def east_armenia(t):
    pts = interp_keys(EAST_KEYS, t)
    return east_poly(pts).intersection(TURKEY_AM).intersection(box(40, 38.8, 47, 40.98))


# ======================================================================= SCRIPT
T = 0.0
# ---------- 0. Açılış
cam(0, 33.5, 41.5, 34)
cam(4.0, 33.0, 40.8, 30)
cam(10.5, 32.5, 39.6, 24)
CLOUDS += [(0, 1.0), (3.0, 0.85), (7.5, 0.25), (10, 0.0)]
TITLES.append((0.4, 4.8, 'year'))
TITLES.append((5.2, 10.6, 'main'))


@L(2.5, 34)
def wide_labels(ctx, v, t):
    a = fade(t, 2.5, 34, 1.5, 1.0) * clamp((v.span - 9) / 6)
    if a <= 0.01:
        return
    region_label(ctx, v, 'KARADENİZ', 34.5, 43.1, a * 0.9, 34, (0.75, 0.88, 1.0), 10)
    region_label(ctx, v, 'AKDENİZ', 30.5, 34.6, a * 0.9, 34, (0.75, 0.88, 1.0), 10)
    region_label(ctx, v, 'EGE\nDENİZİ', 25.0, 38.4, a * 0.8, 26, (0.75, 0.88, 1.0), 6)
    region_label(ctx, v, 'YUNANİSTAN', 22.2, 39.9, a * 0.8, 24, (1, 1, 1), 4)
    region_label(ctx, v, 'BULGARİSTAN', 25.4, 42.75, a * 0.8, 24, (1, 1, 1), 4)
    region_label(ctx, v, 'İRAN', 47.5, 36.2, a * 0.8, 24, (1, 1, 1), 4)


@L(0, 400)
def base_layers(ctx, v, t):
    coast(ctx, v, 1.0)
    borders(ctx, v, 0.8)


@L(1.5, 400)
def turkey_fill(ctx, v, t):
    # Türk (Osmanlı / Ankara) kontrolündeki topraklar: diğer bölgelerin altında kırmızı ton
    a = fade(t, 1.5, 400, 2.0, 0.0)
    strength = 0.22
    if t > 101:
        strength = 0.22 + 0.10 * smooth((t - 101) / 3)
    g = TURKEY
    if T_LAUS <= t:
        g = LAUSANNE
    zone(ctx, v, g, TR, a, fill=strength, edge=True, glow=True, edge_w=2.0)


# ---------- 1. Mondros
CHAPTERS.append((11.0, 14.6, 'I', 'İŞGAL'))
cam(14.0, 26.6, 39.65, 5.0, 0.15)
cam(19.5, 26.4, 39.95, 4.6)
date(11.5, '30 EKİM 1918')
cap(14.6, 21.6, 'MONDROS ATEŞKESİ',
    'Limni adasındaki Mondros Limanı\'nda, HMS Agamemnon zırhlısında imzalandı. 7. madde, İtilaf Devletleri\'ne '
    '"güvenliklerini tehdit eden" her stratejik noktayı işgal etme hakkı veriyordu.')


@L(12.5, 22)
def mondros(ctx, v, t):
    a = fade(t, 12.5, 22, 0.8, 0.8)
    city(ctx, v, 'MONDROS', *C['MONDROS'], a, 32, 'l')
    x, y = v.P(25.32, 39.84)
    ship(ctx, x + 30, y + 10, -0.2, 1.4, a * smooth((t - 13.5) / 0.8))
    badge(ctx, x - 40, y - 80, 'uk', 30, a, pop_curve((t - 14.2) / 0.6))
    badge(ctx, x + 35, y - 80, 'tr', 30, a, pop_curve((t - 14.6) / 0.6))


# İstanbul'un işgali
cam(23.0, 28.2, 40.6, 5.6, 0.1)
cam(26.5, 28.6, 40.75, 5.0)
date(21.8, '13 KASIM 1918')
cap(22.4, 27.6, 'İSTANBUL\'A GİRİŞ', 'İtilaf donanması Çanakkale Boğazı\'nı geçerek İstanbul önlerine demirledi.')
FLEET = [(25.6, 39.6), (26.2, 40.05), (26.7, 40.4), (27.6, 40.7), (28.5, 40.9), (28.95, 40.98)]


@L(22, 400)
def allied_zone(ctx, v, t):
    a = fade(t, 23.4, T_IST_FREE, 0.8, 1.2)
    zone(ctx, v, ALLIED, UK, a, fill=0.52)


@L(21.8, 30)
def fleet(ctx, v, t):
    a = fade(t, 21.8, 30, 0.4, 0.8)
    p = ease_io((t - 22.0) / 3.0)
    arrow(ctx, v, FLEET, p, UK, 24, a)
    city(ctx, v, 'İSTANBUL', *C['ISTANBUL'], a, 34, 'u')
    city(ctx, v, 'ÇANAKKALE', *C['CANAKKALE'], a, 28, 'l')
    x, y = v.P(*C['ISTANBUL'])
    for i, f in enumerate(['uk', 'fr', 'it']):
        badge(ctx, x - 70 + i * 70, y + 70, f, 26, a, pop_curve((t - 24.6 - i * 0.2) / 0.6))


# Güney ve İtalyan işgali
cam(30.0, 33.0, 37.6, 9.0, 0.1)
cam(37.0, 32.6, 37.8, 8.4)
date(28.6, 'ARALIK 1918')
date(33.0, 'MART 1919')
cap(28.8, 32.8, 'GÜNEY\'DE İŞGAL',
    'İngilizler Antep, Maraş ve Urfa\'yı; Fransızlar Adana ve çevresini işgal etti. 1919 sonunda bölge tamamen Fransızlara bırakıldı.')
cap(33.0, 37.4, 'İTALYANLAR ANTALYA\'DA', 'İtalyan birlikleri Antalya\'ya çıkarak güneybatı Anadolu\'ya yayıldı.')


@L(28.5, 400)
def south_zone(ctx, v, t):
    a = fade(t, 28.8, 400, 1.0, 0)
    # Fransız bölgesi: 1920 kurtuluşları → 1921 Ankara Antlaşması
    if t < T_MARAS:
        g = FR0
    elif t < T_ANKARA_TR:
        g = FR1
    else:
        g = FR2
    # yumuşak geçiş için önceki şekli söndür
    zone(ctx, v, g, FR, a, fill=0.52)
    if T_MARAS <= t < T_MARAS + 1.2:
        zone(ctx, v, FR0.difference(FR1), FR, a * (1 - smooth((t - T_MARAS) / 1.2)), fill=0.52, edge=False)
    if T_ANKARA_TR <= t < T_ANKARA_TR + 1.5:
        zone(ctx, v, FR1.difference(FR2), FR, a * (1 - smooth((t - T_ANKARA_TR) / 1.5)), fill=0.52, edge=False)


@L(28.5, 38)
def south_badges(ctx, v, t):
    a = fade(t, 28.5, 38, 0.5, 0.8)
    for n in ['ADANA', 'MARAS', 'ANTEP', 'URFA', 'ANTALYA', 'KONYA']:
        pass
    city(ctx, v, 'ADANA', *C['ADANA'], a, 28, 'd')
    city(ctx, v, 'MARAŞ', *C['MARAS'], a, 28, 'u')
    city(ctx, v, 'ANTEP', *C['ANTEP'], a, 28, 'r')
    city(ctx, v, 'URFA', *C['URFA'], a, 28, 'u')
    x, y = v.P(35.6, 37.25)
    badge(ctx, x, y, 'fr', 28, a, pop_curve((t - 29.2) / 0.6))
    x, y = v.P(37.9, 37.35)
    badge(ctx, x, y, 'uk', 28, a * (1 - smooth((t - 31.8) / 0.8)), pop_curve((t - 29.5) / 0.6))
    a2 = fade(t, 33.0, 38, 0.5, 0.8)
    city(ctx, v, 'ANTALYA', *C['ANTALYA'], a2, 28, 'd')
    x, y = v.P(29.7, 37.05)
    badge(ctx, x, y, 'it', 28, a2, pop_curve((t - 33.4) / 0.6))
    arrow(ctx, v, [(30.2, 35.5), (30.55, 36.3), (30.7, 36.82)], ease_io((t - 33.0) / 1.6), IT, 22, a2)


@L(33.0, 400)
def italy_zone(ctx, v, t):
    a = fade(t, 33.4, T_ITALY_OUT, 1.0, 2.0)
    zone(ctx, v, IT0, IT, a, fill=0.5)


photo(37.4, 42.4, 'mondros', 'İtilaf askerleri İstanbul\'da, 1918–1919', (0.0, 0.0, 1.0, 0.0))

# ---------- 2. İzmir
cam(37.0, 31.0, 38.6, 7.5)
cam(42.4, 27.6, 38.55, 3.6)
cam(46.5, 27.15, 38.48, 2.7, 0.1)
cam(49.0, 27.3, 38.55, 3.0)
date(42.4, '15 MAYIS 1919')
T_IZMIR = 43.6
cap(44.0, 49.8, 'İZMİR\'İN İŞGALİ',
    'Yunan kuvvetleri, Paris Barış Konferansı\'nın onayıyla İzmir\'e çıktı. Gazeteci Hasan Tahsin\'in işgalcilere attığı '
    '"ilk kurşun", direnişin sembolü oldu.')


@L(42.4, 52)
def izmir_landing(ctx, v, t):
    a = fade(t, 42.4, 52, 0.4, 1.0)
    arrow(ctx, v, [(25.6, 38.75), (26.3, 38.62), (26.75, 38.48), (27.08, 38.44)], ease_io((t - 42.8) / 1.6), GR, 28, a)
    city(ctx, v, 'İZMİR', *C['IZMIR'], a, 34, 'r')
    x, y = v.P(26.35, 38.62)
    for i in range(3):
        u = ease_io((t - 42.6 - i * 0.25) / 2.0)
        sx, sy = v.P(lerp(25.8, 26.9, u) - i * 0.12, lerp(38.7, 38.5, u) + 0.06 * (i - 1))
        ship(ctx, sx, sy, 0.2, 1.1, a * smooth((t - 42.6) / 0.5), (0.12, 0.2, 0.35))
    x, y = v.P(*C['IZMIR'])
    badge(ctx, x - 20, y - 75, 'gr', 30, a, pop_curve((t - T_IZMIR - 0.3) / 0.6))


WEST_KEYS.append((T_IZMIR, [(p[0], p[1]) for p in [(27.1, 38.45)] * 12]))
WEST_KEYS.append((T_IZMIR + 2.2, K0))
WEST_KEYS.append((50.0, K0))
WEST_KEYS.append((55.0, K1))

cam(53.0, 27.6, 38.65, 3.6)
cam(57.5, 27.65, 38.75, 3.8)
date(50.0, 'HAZİRAN 1919')
cap(50.4, 57.2, 'KUVÂ-Yİ MİLLİYE',
    'Yunan ordusu Manisa, Aydın ve Ayvalık\'a ilerledi. Düzenli ordu yoktu: Ayvalık, Ödemiş ve Aydın çevresinde halk, '
    'kendi imkânlarıyla direnişe geçti.')


@L(T_IZMIR, 400)
def greek_west(ctx, v, t):
    g = west_greek(t)
    a = fade(t, T_IZMIR, 400, 0.5, 0)
    zone(ctx, v, g, GR, a, fill=0.52)


@L(49.5, 58)
def kuvayi(ctx, v, t):
    a = fade(t, 49.5, 58, 0.5, 0.8)
    for n, s in [('MANISA', 'r'), ('AYDIN', 'd'), ('AYVALIK', 'u'), ('ODEMIS', 'r')]:
        nm = {'MANISA': 'MANİSA', 'AYDIN': 'AYDIN', 'AYVALIK': 'AYVALIK', 'ODEMIS': 'ÖDEMİŞ'}[n]
        city(ctx, v, nm, *C[n], a, 28, s)
    city(ctx, v, 'İZMİR', *C['IZMIR'], a, 32, 'l')
    for i, (lon, lat) in enumerate([(26.95, 39.4), (28.35, 38.32), (28.05, 37.8), (28.3, 38.75)]):
        x, y = v.P(lon, lat)
        badge(ctx, x, y, 'tr', 24, a, pop_curve((t - 52.5 - 0.3 * i) / 0.6))


photo(57.2, 61.6, 'sultanahmet', 'Sultanahmet Mitingi, 23 Mayıs 1919 — İzmir\'in işgali protesto ediliyor', (0.1, 0.0, 0.9, 0.0))

# ---------- 3. Samsun ve kongreler
CHAPTERS.append((61.6, 65.0, 'II', 'UYANIŞ'))
cam(61.6, 29.6, 41.2, 4.6)
cam(64.0, 29.8, 41.3, 4.6)
SHIP_T0, SHIP_T1 = 64.0, 70.5
SHIP_ROUTE = [(28.99, 41.02), (29.07, 41.2), (29.6, 41.35), (31.5, 41.55), (33.5, 42.15), (35.2, 41.9), (36.33, 41.3)]
cam(70.5, 35.6, 41.25, 4.6)
date(64.0, '16 MAYIS 1919')
date(69.6, '19 MAYIS 1919')
cap(65.6, 71.6, 'SAMSUN\'A ÇIKIŞ',
    'Mustafa Kemal Paşa, 9. Ordu Müfettişi olarak Bandırma Vapuru ile İstanbul\'dan ayrıldı ve 19 Mayıs 1919\'da Samsun\'a çıktı.')


@L(61.6, 74)
def bandirma(ctx, v, t):
    a = fade(t, 61.6, 74, 0.5, 1.0)
    p = ease_io((t - SHIP_T0) / (SHIP_T1 - SHIP_T0))
    tip = route(ctx, v, SHIP_ROUTE, p, GOLD, a, 4.5)
    city(ctx, v, 'İSTANBUL', *C['ISTANBUL'], a, 30, 'd')
    city(ctx, v, 'SAMSUN', *C['SAMSUN'], a, 34, 'd')
    if tip is not None and p > 0:
        sp = v.Pa(catmull(SHIP_ROUTE, 200))
        i = min(len(sp) - 2, int(p * (len(sp) - 1)))
        ang = math.atan2(sp[i + 1][1] - sp[i][1], sp[i + 1][0] - sp[i][0])
        ship(ctx, tip[0], tip[1], ang, 1.5, a)
        badge(ctx, tip[0], tip[1] - 60, 'tr', 26, a, pop_curve((t - SHIP_T0) / 0.6))
        font(ctx, 'Oswald', 26)
        shadow_text(ctx, 'BANDIRMA VAPURU', tip[0], tip[1] + 50, GOLD, a * smooth((t - SHIP_T0 - 0.5)), 2, 0.5)
    if t > 69.8:
        x, y = v.P(*C['SAMSUN'])
        u = (t - 69.8) / 1.6
        if u < 1:
            ctx.set_source_rgba(1, 0.85, 0.4, (1 - u) * a)
            ctx.set_line_width(4)
            ctx.arc(x, y, 20 + 140 * ease_out(u), 0, 2 * math.pi)
            ctx.stroke()


# yolculuk: Samsun → Havza → Amasya → Tokat → Sivas → Erzincan → Erzurum ; Erzurum → Sivas ; Sivas → Kayseri → Kırşehir → Ankara
ROUTE1 = [C['SAMSUN'], C['HAVZA'], C['AMASYA'], C['TOKAT'], C['SIVAS'], C['ERZINCAN'], C['ERZURUM']]
ROUTE2 = [C['ERZURUM'], C['ERZINCAN'], C['SIVAS']]
ROUTE3 = [C['SIVAS'], C['KAYSERI'], C['KIRSEHIR'], C['ANKARA']]
cam(73.0, 37.6, 40.3, 7.2, 0.1)
cam(85.0, 38.4, 40.1, 7.6)
cam(92.0, 36.4, 39.9, 7.4)
cam(98.0, 34.9, 39.7, 6.6)
date(72.4, '22 HAZİRAN 1919')
date(78.2, '23 TEMMUZ 1919')
date(84.2, '4 EYLÜL 1919')
date(90.4, '27 ARALIK 1919')
cap(72.6, 78.0, 'AMASYA GENELGESİ', '"Milletin istiklâlini yine milletin azim ve kararı kurtaracaktır."')
cap(78.2, 84.0, 'ERZURUM KONGRESİ',
    '23 Temmuz – 7 Ağustos 1919. Vatanın bir bütün olduğu ve bölünemeyeceği, manda ve himayenin kabul edilemeyeceği ilan edildi.')
cap(84.2, 90.2, 'SİVAS KONGRESİ',
    '4–11 Eylül 1919. Bütün yurttaki direniş cemiyetleri "Anadolu ve Rumeli Müdafaa-i Hukuk Cemiyeti" çatısı altında birleşti.')
cap(90.4, 96.0, 'ANKARA', 'Heyet-i Temsiliye, 27 Aralık 1919\'da Ankara\'ya geldi. Millî Mücadele\'nin merkezi artık burasıydı.')


@L(71.5, 99.5)
def congresses(ctx, v, t):
    a = fade(t, 71.5, 99.5, 0.6, 1.2)
    p1 = ease_io((t - 72.0) / 7.0)
    p2 = ease_io((t - 83.0) / 2.4)
    p3 = ease_io((t - 88.0) / 3.2)
    route(ctx, v, ROUTE1, p1, GOLD, a, 4.2, (12, 9))
    route(ctx, v, ROUTE2, p2, GOLD, a * 0.85, 3.4, (6, 8))
    tip = route(ctx, v, ROUTE3, p3, GOLD, a, 4.2, (12, 9))
    stops = [('SAMSUN', 72.0, 'u', 28), ('HAVZA', 72.6, 'u', 24), ('AMASYA', 73.2, 'u', 30), ('TOKAT', 74.6, 'd', 24),
             ('SIVAS', 75.6, 'd', 30), ('ERZINCAN', 77.2, 'u', 24), ('ERZURUM', 78.2, 'u', 34), ('KAYSERI', 88.9, 'd', 24),
             ('KIRSEHIR', 89.6, 'u', 24), ('ANKARA', 90.8, 'u', 36)]
    names = dict(SIVAS='SİVAS', ERZINCAN='ERZİNCAN', KAYSERI='KAYSERİ', KIRSEHIR='KIRŞEHİR')
    for n, ts, side, sz in stops:
        city(ctx, v, names.get(n, n), *C[n], a * smooth((t - ts) / 0.5), sz, side, capital=(n == 'ANKARA' and t > 91))
    # congress halos
    for n, t0 in [('AMASYA', 73.2), ('ERZURUM', 78.4), ('SIVAS', 84.4), ('ANKARA', 90.8)]:
        x, y = v.P(*C[n])
        u = (t - t0) / 2.0
        if 0 < u < 1:
            ctx.set_source_rgba(1, 0.85, 0.4, (1 - u) * a)
            ctx.set_line_width(4)
            ctx.arc(x, y, 18 + 120 * ease_out(u), 0, 2 * math.pi)
            ctx.stroke()
        if t > t0:
            glow_dot(ctx, x, y, 36, (1, 0.8, 0.35), 0.5 * a)


photo(96.0, 100.6, 'sivas1919', 'Mustafa Kemal Paşa ve Heyet-i Temsiliye üyeleri, Sivas, 1919', (0.5, 0.5, 0.5, 0.5), (1.0, 1.1))

# ---------- 4. İstanbul işgali ve TBMM
cam(100.0, 29.1, 41.0, 2.4)
cam(104.5, 29.0, 41.02, 2.1)
date(100.6, '16 MART 1920')
cap(101.0, 105.6, 'İSTANBUL RESMEN İŞGAL EDİLDİ',
    'Meclis-i Mebusan\'ın çalışması imkânsız hale geldi; birçok milletvekili tutuklanarak Malta\'ya sürgün edildi.')
T_TBMM = 107.6
cam(T_TBMM, 32.6, 39.9, 3.0, 0.5)
cam(T_TBMM + 6.0, 32.8, 39.85, 2.6)
date(T_TBMM - 0.4, '23 NİSAN 1920')
cap(T_TBMM, T_TBMM + 6.2, 'TÜRKİYE BÜYÜK MİLLET MECLİSİ',
    'Ankara\'da açılan Meclis, millî iradenin tek temsilcisi oldu. Direniş artık bir devletin elindeydi.')


@L(100.0, 106.8)
def ist_occupy(ctx, v, t):
    a = fade(t, 100.0, 106.8, 0.4, 0.6)
    city(ctx, v, 'İSTANBUL', *C['ISTANBUL'], a, 36, 'u')
    x, y = v.P(*C['ISTANBUL'])
    for i, f in enumerate(['uk', 'uk', 'fr', 'it']):
        ang = -0.8 + i * 0.55
        badge(ctx, x + 150 * math.cos(ang), y + 150 * math.sin(ang) + 40, f, 30, a, pop_curve((t - 101.0 - i * 0.18) / 0.6))
    u = (t - 100.8) % 1.2 / 1.2
    ctx.set_source_rgba(0.8, 0.5, 1.0, (1 - u) * a * 0.8)
    ctx.set_line_width(3)
    ctx.arc(x, y, 30 + 120 * u, 0, 2 * math.pi)
    ctx.stroke()


@L(T_TBMM - 1.0, 400)
def ankara(ctx, v, t):
    a = fade(t, T_TBMM - 1.0, 400, 0.6, 0)
    big = fade(t, T_TBMM - 1.0, T_TBMM + 6.4, 0.6, 0.8)
    x, y = v.P(*C['ANKARA'])
    small = a * clamp((14 - v.span) / 6)
    glow_dot(ctx, x, y, 70 + 20 * math.sin(t * 2), (1, 0.75, 0.3), 0.55 * big + 0.25 * small)
    if big > 0.01:
        u = ((t - T_TBMM) % 2.0) / 2.0
        ctx.set_source_rgba(1, 0.85, 0.45, (1 - u) * big)
        ctx.set_line_width(3)
        ctx.arc(x, y, 30 + 200 * u, 0, 2 * math.pi)
        ctx.stroke()
        badge(ctx, x, y - 95, 'tr', 36, big, pop_curve((t - T_TBMM + 0.3) / 0.6))
    city(ctx, v, 'ANKARA', *C['ANKARA'], max(big, small), 40 if big > 0.5 else 32, 'r', capital=True)


photo(T_TBMM + 6.2, T_TBMM + 10.8, 'tbmm1921', 'Mustafa Kemal Paşa Büyük Millet Meclisi kürsüsünde, 1 Mart 1921', (0.0, 0.0, 1.0, 0.0))

# ---------- 5. Yunan yaz taarruzu ve Sevr
T5 = T_TBMM + 10.8           # 118.4
CHAPTERS.append((T5, T5 + 3.4, 'III', 'CEPHELER'))
cam(T5, 28.2, 39.6, 7.6)
cam(T5 + 10.5, 28.6, 39.9, 8.0)
date(T5 + 2.0, '22 HAZİRAN 1920')
date(T5 + 5.2, '8 TEMMUZ 1920')
date(T5 + 7.0, '25 TEMMUZ 1920')
WEST_KEYS.append((T5 + 2.0, K1))
WEST_KEYS.append((T5 + 8.5, K2))
cap(T5 + 3.4, T5 + 10.4, 'YUNAN YAZ TAARRUZU · 1920',
    'İngiltere\'nin desteğini alan Yunan ordusu Bursa\'yı (8 Temmuz), Edirne\'yi (25 Temmuz) ve Uşak\'ı (29 Ağustos) ele geçirdi.')
T_THRACE = T5 + 6.4


@L(T5 + 1.5, T5 + 11.5)
def greek_summer(ctx, v, t):
    a = fade(t, T5 + 1.5, T5 + 11.5, 0.5, 1.0)
    arrow(ctx, v, [(27.3, 38.85), (27.85, 39.55), (28.5, 39.95), (29.0, 40.15)], ease_io((t - T5 - 2.0) / 3.2), GR, 30, a)
    arrow(ctx, v, [(27.9, 38.55), (28.6, 38.62), (29.35, 38.66)], ease_io((t - T5 - 3.0) / 3.2), GR, 26, a)
    arrow(ctx, v, [(25.2, 40.9), (25.9, 41.2), (26.5, 41.6)], ease_io((t - T5 - 5.6) / 2.2), GR, 24, a)
    city(ctx, v, 'BURSA', *C['BURSA'], a * smooth((t - T5 - 4.6) / 0.5), 30, 'r')
    city(ctx, v, 'UŞAK', *C['USAK'], a * smooth((t - T5 - 5.6) / 0.5), 28, 'r')
    city(ctx, v, 'EDİRNE', *C['EDIRNE'], a * smooth((t - T5 - 6.8) / 0.5), 28, 'r')
    city(ctx, v, 'İZMİR', *C['IZMIR'], a, 28, 'l')


@L(T_THRACE, 400)
def thrace(ctx, v, t):
    a = fade(t, T_THRACE, T_MUDANYA + 2.5, 1.2, 2.5)
    zone(ctx, v, THRACE, GR, a, fill=0.52)


T_SEVR = T5 + 11.0     # 129.4
cam(T_SEVR, 35.0, 38.8, 28.5, 0.0)
cam(T_SEVR + 11.5, 35.1, 38.9, 27.5)
date(T_SEVR + 0.6, '10 AĞUSTOS 1920')
cap(T_SEVR + 1.0, T_SEVR + 11.4, 'SEVR ANTLAŞMASI',
    'İstanbul hükümetinin imzaladığı antlaşma Anadolu\'yu paylaştırıyordu. TBMM, Sevr\'i tanımadı ve yok hükmünde saydı. '
    '(Harita bölgeleri yaklaşık olarak gösterir.)')
SV = [(SV_GR, GR, 'YUNANİSTAN', (27.3, 38.6), 0.0), (SV_ST, UK, 'BOĞAZLAR\nBÖLGESİ', (28.0, 40.25), 0.6),
      (SV_IT, IT, 'İTALYAN\nNÜFUZ BÖLGESİ', (30.4, 37.2), 1.2), (SV_FR, FR, 'FRANSIZ\nNÜFUZ BÖLGESİ', (37.0, 37.5), 1.8),
      (SV_AM, AM, 'ERMENİSTAN', (41.6, 40.0), 2.4), (SV_KU, KU, 'ÖZERK BÖLGE\n(ÖNGÖRÜLEN)', (41.6, 37.95), 3.0)]
STAMPS.append((T_SEVR + 7.2, T_SEVR + 11.6, 'TBMM TANIMADI', 0.5, 0.40, -0.18))


@L(T_SEVR, T_SEVR + 12.2)
def sevr(ctx, v, t):
    a = fade(t, T_SEVR, T_SEVR + 12.2, 0.5, 1.2)
    for g, col, nm, (lx, ly), d in SV:
        u = smooth((t - T_SEVR - 1.2 - d) / 0.8)
        zone(ctx, v, g, col, a * u, fill=0.55, hatch=True)
    for g, col, nm, (lx, ly), d in SV:
        u = smooth((t - T_SEVR - 1.5 - d) / 0.8)
        region_label(ctx, v, nm, lx, ly, a * u, 24, (1, 1, 1), 2, 'Oswald', True)
    u = smooth((t - T_SEVR - 4.8) / 0.8)
    region_label(ctx, v, 'TÜRK DEVLETİ', 34.0, 39.6, a * u, 26, (1, 0.9, 0.7), 4, 'Cinzel', True)
    city(ctx, v, 'ANKARA', *C['ANKARA'], a * u, 24, 'r', capital=True)
    city(ctx, v, 'İSTANBUL', *C['ISTANBUL'], a * u, 22, 'u')


# ---------- 6. Doğu Cephesi
T6 = T_SEVR + 12.2     # 141.6
cam(T6, 42.3, 40.3, 4.8, 0.5)
cam(T6 + 4.0, 42.5, 40.35, 4.4)
cam(T6 + 12.0, 43.2, 40.45, 4.3)
cam(T6 + 15.0, 43.3, 40.4, 4.6)
date(T6 + 0.8, '28 EYLÜL 1920')
date(T6 + 5.2, '30 EKİM 1920')
date(T6 + 8.4, '7 KASIM 1920')
date(T6 + 11.2, '3 ARALIK 1920')
EAST_KEYS += [(0, E0), (T6 + 3.6, E0), (T6 + 6.4, E1), (T6 + 9.0, E1), (T6 + 12.0, E2)]
cap(T6 + 1.0, T6 + 8.2, 'DOĞU CEPHESİ',
    'Kâzım Karabekir Paşa komutasındaki 15. Kolordu, 29 Eylül\'de Sarıkamış\'ı, 30 Ekim\'de Kars\'ı, 7 Kasım\'da Gümrü\'yü aldı.')
cap(T6 + 11.2, T6 + 16.0, 'GÜMRÜ ANTLAŞMASI',
    'TBMM\'nin imzaladığı ilk uluslararası antlaşma. Doğu Cephesi kapandı; bu cephedeki kuvvetler batıya kaydırılabildi.')


@L(T6 - 0.5, 400)
def armenia(ctx, v, t):
    a = fade(t, T6 - 0.5, 400, 1.0, 0)
    if t > T6 + 12.5:
        a *= max(0.45, 1 - smooth((t - T6 - 12.5) / 2.0) * 0.55)
    zone(ctx, v, east_armenia(t), AM, a, fill=0.52)


@L(T6, T6 + 16.5)
def east_front(ctx, v, t):
    a = fade(t, T6, T6 + 16.5, 0.5, 1.0)
    city(ctx, v, 'ERZURUM', *C['ERZURUM'], a, 30, 'd')
    city(ctx, v, 'SARIKAMIŞ', *C['SARIKAMIS'], a * smooth((t - T6 - 1.5) / 0.5), 28, 'l')
    city(ctx, v, 'KARS', *C['KARS'], a, 32, 'u')
    city(ctx, v, 'GÜMRÜ', *C['GUMRU'], a, 28, 'u')
    region_label(ctx, v, 'ERMENİSTAN', 44.6, 40.35, a, 26, (1, 0.85, 0.65), 4, 'Oswald', True)
    arrow(ctx, v, [(41.35, 39.95), (41.9, 40.12), (42.48, 40.3)], ease_io((t - T6 - 1.0) / 2.4), TR, 28, a)
    arrow(ctx, v, [(42.6, 40.38), (42.85, 40.55), (43.03, 40.6)], ease_io((t - T6 - 4.0) / 2.2), TR, 26, a)
    arrow(ctx, v, [(43.15, 40.62), (43.5, 40.75), (43.8, 40.78)], ease_io((t - T6 - 7.0) / 2.0), TR, 24, a)
    battle(ctx, v, *C['SARIKAMIS'], t, T6 + 2.6, T6 + 5.0, seed=11, radius=0.12)
    battle(ctx, v, *C['KARS'], t, T6 + 5.0, T6 + 8.0, seed=12, radius=0.12)
    x, y = v.P(41.6, 40.25)
    badge(ctx, x, y - 60, 'tr', 30, a, pop_curve((t - T6 - 1.2) / 0.6))
    x, y = v.P(43.9, 40.15)
    badge(ctx, x, y, 'am', 28, a * (1 - smooth((t - T6 - 9.0) / 1.0)), pop_curve((t - T6 - 0.8) / 0.6))


# ---------- 7. Güney Cephesi
T7 = T6 + 16.5          # 158.1
T_MARAS = T7 + 4.6
cam(T7, 37.6, 37.4, 3.6, 0.5)
cam(T7 + 14.0, 37.5, 37.35, 3.4)
date(T7 + 0.8, '12 ŞUBAT 1920')
date(T7 + 4.8, '11 NİSAN 1920')
date(T7 + 8.6, '9 ŞUBAT 1921')
cap(T7 + 1.0, T7 + 8.4, 'GÜNEY CEPHESİ',
    'Burada düzenli ordu yoktu; şehirleri halk savundu. Maraş 12 Şubat, Urfa 11 Nisan 1920\'de Fransızlardan kurtarıldı.')
cap(T7 + 8.6, T7 + 14.4, 'ANTEP SAVUNMASI',
    '10 ayı aşan kuşatmanın sonunda şehir teslim olmak zorunda kaldı. TBMM, Antep\'e "Gazi" unvanını verdi.')


@L(T7, T7 + 15)
def south_front(ctx, v, t):
    a = fade(t, T7, T7 + 15, 0.6, 1.0)
    city(ctx, v, 'MARAŞ', *C['MARAS'], a, 32, 'u')
    city(ctx, v, 'URFA', *C['URFA'], a, 32, 'u')
    city(ctx, v, 'ANTEP', *C['ANTEP'], a, 32, 'd')
    city(ctx, v, 'ADANA', *C['ADANA'], a, 28, 'd')
    region_label(ctx, v, 'FRANSIZ MANDASI\nSURİYE', 37.6, 36.2, a * 0.9, 22, (0.8, 0.95, 1.0), 3, 'Oswald', True)
    battle(ctx, v, *C['MARAS'], t, T7 + 0.6, T7 + 4.4, seed=21, radius=0.08)
    battle(ctx, v, *C['URFA'], t, T7 + 4.4, T7 + 8.4, seed=22, radius=0.08)
    battle(ctx, v, *C['ANTEP'], t, T7 + 8.4, T7 + 14.4, seed=23, radius=0.08)
    for n, t0 in [('MARAS', T7 + 3.6), ('URFA', T7 + 7.4)]:
        x, y = v.P(*C[n])
        badge(ctx, x + 70, y + 40, 'tr', 26, a, pop_curve((t - t0) / 0.6))
    x, y = v.P(*C['ANTEP'])
    badge(ctx, x - 70, y + 50, 'tr', 26, a * (1 - smooth((t - T7 - 12.0) / 0.8)), pop_curve((t - T7 - 8.8) / 0.6))
    badge(ctx, x + 70, y + 50, 'fr', 26, a, pop_curve((t - T7 - 1.0) / 0.6))
    # kuşatma halkası
    if t > T7 + 8.6:
        u = smooth((t - T7 - 8.6) / 1.2)
        ctx.set_dash([10, 8], -t * 30)
        ctx.set_source_rgba(0.6, 0.9, 1.0, 0.85 * a * u)
        ctx.set_line_width(4)
        ctx.arc(x, y, 0.14 * v.px_per_deg(), 0, 2 * math.pi)
        ctx.stroke()
        ctx.set_dash([])


photo(T7 + 15.0, T7 + 19.6, 'ankara1920', 'Mustafa Kemal Paşa Ankara\'da birlikleri denetliyor, 1920 — düzenli ordu kuruluyor', (0.3, 0.5, 0.7, 0.5), (1.0, 1.1))

# ---------- 8. İnönü
T8 = T7 + 19.6          # 177.7
CHAPTERS.append((T8, T8 + 3.4, 'IV', 'DÜZENLİ ORDU'))
cam(T8, 29.9, 39.95, 3.6, 0.4)
cam(T8 + 8.0, 30.0, 39.9, 3.2)
date(T8 + 1.8, '6 OCAK 1921')
date(T8 + 6.4, '10 OCAK 1921')
cap(T8 + 3.4, T8 + 9.6, 'I. İNÖNÜ MUHAREBESİ',
    'Yeni kurulan düzenli ordunun ilk sınavı. İsmet Bey komutasındaki birlikler Yunan ilerleyişini İnönü\'de durdurdu.')


@L(T8 + 1.0, T8 + 10.4)
def inonu1(ctx, v, t):
    a = fade(t, T8 + 1.0, T8 + 10.4, 0.5, 0.8)
    pin = ease_io((t - T8 - 2.0) / 2.4)
    pout = smooth((t - T8 - 6.8) / 1.8)
    arrow(ctx, v, [(29.15, 40.18), (29.6, 40.0), (30.05, 39.86)], pin * (1 - 0.65 * pout), GR, 30, a)
    city(ctx, v, 'BURSA', *C['BURSA'], a, 30, 'l')
    city(ctx, v, 'ESKİŞEHİR', *C['ESKISEHIR'], a, 30, 'r')
    city(ctx, v, 'BİLECİK', *C['BILECIK'], a, 26, 'u')
    battle(ctx, v, *C['INONU'], t, T8 + 3.6, T8 + 10.0, 'I. İNÖNÜ', '6–10 OCAK 1921', 'd', seed=31, radius=0.12)
    x, y = v.P(30.3, 39.78)
    badge(ctx, x + 40, y - 30, 'tr', 30, a, pop_curve((t - T8 - 3.0) / 0.6))
    if pout > 0:
        arrow(ctx, v, [(30.25, 39.8), (29.95, 39.9), (29.6, 40.0)], ease_io((t - T8 - 6.8) / 1.8), TR, 24, a)


photo(T8 + 10.0, T8 + 14.4, 'eskisehir1921', 'Mustafa Kemal Paşa ve karargâhı, Eskişehir yakınlarında cephe ziyaretinde, Şubat 1921', (0.2, 0.2, 0.8, 0.2), (1.0, 1.12))

T82 = T8 + 14.4         # 192.1
cam(T82, 30.0, 39.4, 4.4, 0.3)
cam(T82 + 9.0, 30.0, 39.45, 4.2)
date(T82 + 0.8, '23 MART 1921')
date(T82 + 5.6, '31 MART 1921')
cap(T82 + 1.0, T82 + 7.0, 'II. İNÖNÜ MUHAREBESİ',
    'Yunan ordusu iki koldan saldırdı. İnönü\'de yeniden durduruldu; güneyde geçici olarak alınan Afyon\'dan da çekilmek zorunda kaldı.')
QUOTES.append((T82 + 7.0, T82 + 12.4, '"Siz orada yalnız düşmanı değil, milletin makûs talihini de yendiniz."',
               'Mustafa Kemal Paşa, II. İnönü zaferi üzerine'))


@L(T82, T82 + 12.6)
def inonu2(ctx, v, t):
    a = fade(t, T82, T82 + 12.6, 0.5, 0.8)
    pin = ease_io((t - T82 - 1.0) / 2.6)
    pout = smooth((t - T82 - 5.2) / 1.8)
    arrow(ctx, v, [(29.15, 40.18), (29.6, 40.0), (30.05, 39.86)], pin * (1 - 0.65 * pout), GR, 28, a)
    arrow(ctx, v, [(29.45, 38.68), (29.95, 38.82), (30.48, 38.78)], pin * (1 - 0.65 * pout), GR, 26, a)
    city(ctx, v, 'BURSA', *C['BURSA'], a, 28, 'l')
    city(ctx, v, 'ESKİŞEHİR', *C['ESKISEHIR'], a, 28, 'r')
    city(ctx, v, 'UŞAK', *C['USAK'], a, 26, 'l')
    city(ctx, v, 'AFYON', *C['AFYON'], a, 28, 'r')
    city(ctx, v, 'KÜTAHYA', *C['KUTAHYA'], a, 26, 'l')
    battle(ctx, v, *C['INONU'], t, T82 + 2.4, T82 + 7.2, 'II. İNÖNÜ', '23 MART – 1 NİSAN 1921', 'r', seed=41, radius=0.14)


@L(0, 400)
def italy_note(ctx, v, t):
    pass


T_ITALY_OUT = T82 + 6.0

# ---------- 9. Kütahya–Eskişehir
T9 = T82 + 12.6        # 204.7
cam(T9, 30.6, 39.35, 4.8, 0.2)
cam(T9 + 8.0, 31.0, 39.4, 5.0)
cam(T9 + 13.0, 31.3, 39.45, 5.0)
date(T9 + 0.6, '10 TEMMUZ 1921')
date(T9 + 5.0, '24 TEMMUZ 1921')
date(T9 + 8.6, 'AĞUSTOS 1921')
WEST_KEYS.append((T8 + 1.0, K2))
WEST_KEYS.append((T9, K3))
WEST_KEYS.append((T9 + 5.4, K4))
cap(T9 + 0.8, T9 + 8.4, 'KÜTAHYA–ESKİŞEHİR MUHAREBELERİ',
    'Yunan ordusu Afyon, Kütahya ve Eskişehir\'i aldı. Mustafa Kemal Paşa, ordunun Sakarya Nehri\'nin doğusuna çekilmesini emretti.')
cap(T9 + 8.6, T9 + 13.6, 'BAŞKOMUTANLIK VE TEKÂLİF-İ MİLLİYE',
    'TBMM, Mustafa Kemal\'i Başkomutan seçti (5 Ağustos 1921). Tekâlif-i Millîye emirleriyle millet, son imkânlarını cepheye seferber etti.')


@L(T9, T9 + 14)
def kut_esk(ctx, v, t):
    a = fade(t, T9, T9 + 14, 0.5, 0.8)
    for pts, d in [([(29.6, 39.95), (30.1, 39.85), (30.5, 39.78)], 0.6), ([(29.5, 39.45), (29.98, 39.42)], 0.9),
                   ([(29.6, 38.75), (30.1, 38.8), (30.5, 38.76)], 1.2)]:
        arrow(ctx, v, pts, ease_io((t - T9 - d) / 3.0), GR, 28, a * (1 - smooth((t - T9 - 8) / 1.0)))
    arrow(ctx, v, [(30.6, 39.75), (31.2, 39.7), (31.85, 39.65)], ease_io((t - T9 - 4.4) / 2.6), TR, 22, a * (1 - smooth((t - T9 - 9) / 1.0)), tail_fade=True)
    for n, nm, s in [('ESKISEHIR', 'ESKİŞEHİR', 'u'), ('KUTAHYA', 'KÜTAHYA', 'l'), ('AFYON', 'AFYON', 'd'), ('POLATLI', 'POLATLI', 'r')]:
        city(ctx, v, nm, *C[n], a, 28, s)
    rivers(ctx, v, ['Sakarya'], a * smooth((t - T9 - 4) / 1.0))
    font(ctx, 'Oswald', 26, True)
    x, y = v.P(31.25, 39.98)
    shadow_text(ctx, 'SAKARYA', x, y, (0.7, 0.88, 1.0), a * smooth((t - T9 - 4.5) / 0.6), 4, 0.5)


# ---------- 10. Sakarya
T10 = T9 + 14.0        # 218.7
CHAPTERS.append((T10, T10 + 3.4, 'V', 'SAKARYA'))
cam(T10, 32.05, 39.62, 3.0, 0.2)
cam(T10 + 10.0, 32.2, 39.6, 2.6)
cam(T10 + 16.0, 31.8, 39.55, 3.2)
cam(T10 + 21.0, 31.4, 39.4, 4.2)
date(T10 + 3.0, '23 AĞUSTOS 1921')
date(T10 + 14.0, '13 EYLÜL 1921')
WEST_KEYS.append((T10 + 3.4, K4))
WEST_KEYS.append((T10 + 9.4, K5))
WEST_KEYS.append((T10 + 14.4, K5))
WEST_KEYS.append((T10 + 19.0, K6))
cap(T10 + 3.4, T10 + 8.6, 'SAKARYA MEYDAN MUHAREBESİ',
    '23 Ağustos 1921. Yunan ordusu Ankara\'yı almak için Sakarya\'yı geçti. Savaş, 100 km\'lik bir cephede 22 gün 22 gece sürdü.')
QUOTES.append((T10 + 8.8, T10 + 13.8, '"Hattı müdafaa yoktur, sathı müdafaa vardır. O satıh bütün vatandır."', 'Mustafa Kemal Paşa'))
cap(T10 + 14.2, T10 + 21.0, 'SAKARYA ZAFERİ',
    'Yunan ordusu geri çekildi. 1683 Viyana bozgunundan beri süren geri çekiliş sona erdi. TBMM, Mustafa Kemal\'e Mareşal rütbesi ve Gazi unvanı verdi.')


@L(T10, T10 + 21.5)
def sakarya(ctx, v, t):
    a = fade(t, T10, T10 + 21.5, 0.5, 1.0)
    rivers(ctx, v, ['Sakarya'], a)
    city(ctx, v, 'POLATLI', *C['POLATLI'], a, 30, 'r')
    city(ctx, v, 'ESKİŞEHİR', *C['ESKISEHIR'], a, 28, 'l')
    city(ctx, v, 'DUATEPE', *C['DUATEPE'], a * fade(t, T10 + 4, T10 + 14, 0.5, 0.5), 24, 'd', dot=True)
    gin = ease_io((t - T10 - 3.4) / 5.0)
    gout = smooth((t - T10 - 14.4) / 2.0)
    for pts in [[(31.0, 39.85), (31.6, 39.75), (32.0, 39.68)], [(31.1, 39.45), (31.7, 39.45), (32.08, 39.5)],
                [(31.2, 39.15), (31.7, 39.25), (32.0, 39.32)]]:
        arrow(ctx, v, pts, gin, GR, 26, a * (1 - gout))
    for pts in [[(32.45, 39.55), (32.05, 39.62), (31.4, 39.75)], [(32.4, 39.35), (31.95, 39.35), (31.3, 39.35)]]:
        arrow(ctx, v, pts, ease_io((t - T10 - 14.4) / 3.0), TR, 30, a)
    battle(ctx, v, 32.12, 39.55, t, T10 + 5.0, T10 + 15.0, 'SAKARYA', '23 AĞUSTOS – 13 EYLÜL 1921', 'r', seed=51, radius=0.28, size=1.2)
    x, y = v.P(32.55, 39.75)
    badge(ctx, x, y, 'tr', 32, a, pop_curve((t - T10 - 3.6) / 0.6))
    x, y = v.P(31.3, 39.6)
    badge(ctx, x, y, 'gr', 30, a, pop_curve((t - T10 - 3.8) / 0.6))
    # gün sayacı
    if T10 + 4 < t < T10 + 14.2:
        day = 1 + int(21 * clamp((t - T10 - 4.0) / 9.8))
        aa = fade(t, T10 + 4, T10 + 14.2, 0.5, 0.5) * a
        font(ctx, 'Cinzel', 90, True)
        shadow_text(ctx, f'{day}', W / 2, 640, (1, 0.85, 0.45), aa, 0, 0.5, sh=1)
        font(ctx, 'Oswald', 30, False)
        shadow_text(ctx, '. GÜN', W / 2, 690, (1, 1, 1), aa, 6, 0.5)


photo(T10 + 21.5, T10 + 26.0, 'infantry1921', 'Millî Mücadele\'nin Türk piyadesi, 1921', (0.0, 0.3, 1.0, 0.3), (1.0, 1.1))

# ---------- 11. Diplomasi
T11 = T10 + 26.0       # 244.7
T_ANKARA_TR = T11 + 6.4
cam(T11, 35.6, 39.2, 30.0, 0.0)
cam(T11 + 11.0, 35.6, 39.1, 29.0)
date(T11 + 1.0, '13 EKİM 1921')
date(T11 + 6.0, '20 EKİM 1921')
cap(T11 + 1.2, T11 + 5.8, 'KARS ANTLAŞMASI', 'Kafkas cumhuriyetleriyle imzalanan antlaşma ile doğu sınırı kesinleşti.')
cap(T11 + 6.0, T11 + 11.0, 'ANKARA ANTLAŞMASI',
    'Fransa, TBMM\'yi muhatap aldı ve Güney Cephesi\'nden çekildi. İtalyanlar da 1921 içinde Anadolu\'dan ayrılmıştı.')


@L(T11, T11 + 11.4)
def diplomacy(ctx, v, t):
    a = fade(t, T11, T11 + 11.4, 0.6, 0.8)
    city(ctx, v, 'ANKARA', *C['ANKARA'], a, 26, 'r', capital=True)
    city(ctx, v, 'KARS', *C['KARS'], a * fade(t, T11 + 1, T11 + 6.2, 0.5, 0.5), 26, 'u')
    city(ctx, v, 'ADANA', *C['ADANA'], a * fade(t, T11 + 6, T11 + 11.4, 0.5, 0.5), 24, 'd')
    x, y = v.P(42.8, 40.2)
    badge(ctx, x, y, 'tr', 26, a * fade(t, T11 + 1, T11 + 6.2, 0.4, 0.5), pop_curve((t - T11 - 1.4) / 0.6))
    x, y = v.P(35.6, 36.9)
    badge(ctx, x, y, 'fr', 26, a * fade(t, T11 + 5.6, T11 + 9.0, 0.4, 0.6), pop_curve((t - T11 - 5.8) / 0.6))
    region_label(ctx, v, 'YUNAN İŞGALİ', 28.6, 38.9, a, 20, (0.85, 0.92, 1.0), 2, 'Oswald', True)


# ---------- 12. Büyük Taarruz
T12 = T11 + 11.4      # 256.1
CHAPTERS.append((T12, T12 + 3.4, 'VI', 'BÜYÜK TAARRUZ'))
cam(T12, 30.35, 38.75, 2.6, 0.4)
cam(T12 + 8.0, 30.3, 38.8, 2.3)
date(T12 + 2.6, '26 AĞUSTOS 1922')
date(T12 + 7.6, '27 AĞUSTOS 1922')
cap(T12 + 3.0, T12 + 9.6, 'BÜYÜK TAARRUZ',
    'Sabah 05.30\'da topçu ateşiyle başladı. Başkomutan Mustafa Kemal Paşa harekâtı Kocatepe\'den bizzat yönetti. 27 Ağustos\'ta Afyon kurtarıldı.')


@L(T12, T12 + 10.6)
def offensive(ctx, v, t):
    a = fade(t, T12, T12 + 10.6, 0.5, 0.6)
    city(ctx, v, 'AFYON', *C['AFYON'], a, 32, 'r')
    x, y = v.P(*C['KOCATEPE'])
    badge(ctx, x, y + 60, 'tr', 34, a, pop_curve((t - T12 - 2.8) / 0.6))
    region_label(ctx, v, 'KOCATEPE', C['KOCATEPE'][0], C['KOCATEPE'][1] - 0.12, a * smooth((t - T12 - 3) / 0.6), 26, GOLD, 3, 'Oswald', True)
    if T12 + 3.2 < t:
        font(ctx, 'Cinzel', 46, True)
        shadow_text(ctx, '05.30', x, y - 40, (1, 0.9, 0.6), a * fade(t, T12 + 3.2, T12 + 6.5, 0.4, 0.6), 2, 0.5, sh=1)
    # topçu ateşi
    battle(ctx, v, 30.35, 38.62, t, T12 + 3.4, T12 + 9.0, None, None, seed=61, radius=0.2, flashes=True, size=0.01)
    for pts, d in [([(30.48, 38.55), (30.38, 38.68), (30.2, 38.82)], 4.2), ([(30.7, 38.6), (30.62, 38.72), (30.56, 38.77)], 5.2),
                   ([(30.2, 38.52), (30.05, 38.66), (29.95, 38.8)], 4.8)]:
        arrow(ctx, v, pts, ease_io((t - T12 - d) / 2.6), TR, 26, a)


WEST_KEYS.append((T12 + 4.0, K6))
WEST_KEYS.append((T12 + 9.0, [(30.05, 40.55), (30.35, 40.12), (30.62, 39.88), (30.8, 39.7), (30.75, 39.3), (30.35, 38.95),
                              (30.1, 38.82), (29.85, 38.6), (29.5, 38.3), (29.0, 38.0), (28.4, 37.7), (27.25, 37.52)]))

T122 = T12 + 10.6     # 266.7
cam(T122, 29.95, 38.95, 2.6, 0.2)
cam(T122 + 7.0, 29.9, 38.92, 2.4)
date(T122 + 0.6, '30 AĞUSTOS 1922')
cap(T122 + 0.8, T122 + 7.4, 'BAŞKOMUTAN MEYDAN MUHAREBESİ',
    'Yunan ordusunun ana gücü Dumlupınar çevresinde kuşatılarak dağıtıldı. Başkomutan Trikupis birkaç gün sonra esir alındı.')
WEST_KEYS.append((T122 + 6.0, K7))


@L(T122, T122 + 7.8)
def baskomutan(ctx, v, t):
    a = fade(t, T122, T122 + 7.8, 0.5, 0.6)
    city(ctx, v, 'DUMLUPINAR', *C['DUMLUPINAR'], a, 28, 'd')
    city(ctx, v, 'AFYON', *C['AFYON'], a, 26, 'r')
    city(ctx, v, 'UŞAK', *C['USAK'], a, 26, 'l')
    for pts, d in [([(30.3, 39.25), (30.05, 39.15), (29.85, 38.98)], 0.6), ([(30.35, 38.65), (30.05, 38.72), (29.86, 38.86)], 0.8),
                   ([(30.0, 38.55), (29.7, 38.7), (29.75, 38.88)], 1.2)]:
        arrow(ctx, v, pts, ease_io((t - T122 - d) / 2.4), TR, 26, a)
    battle(ctx, v, *C['ALIHANLAR'], t, T122 + 1.6, T122 + 7.6, 'KUŞATMA', '30 AĞUSTOS 1922', 'u', seed=71, radius=0.12)
    # kuşatma çemberi
    x, y = v.P(*C['ALIHANLAR'])
    u = smooth((t - T122 - 2.6) / 1.4)
    if u > 0:
        ctx.set_source_rgba(0.9, 0.1, 0.15, 0.9 * a)
        ctx.set_line_width(6)
        ctx.set_dash([16, 10], -t * 40)
        ctx.arc(x, y, 0.16 * v.px_per_deg(), -math.pi / 2, -math.pi / 2 + 2 * math.pi * u)
        ctx.stroke()
        ctx.set_dash([])


T123 = T122 + 7.8     # 274.5
cam(T123, 29.0, 38.9, 5.6, 0.25)
cam(T123 + 7.0, 28.2, 38.75, 5.4)
date(T123 + 0.5, '1 EYLÜL 1922')
QUOTES.append((T123 + 0.6, T123 + 5.6, '"Ordular! İlk hedefiniz Akdeniz\'dir. İleri!"', 'Başkomutan Mustafa Kemal Paşa, 1 Eylül 1922'))
WEST_KEYS.append((T123 + 6.4, K8))
WEST_KEYS.append((T123 + 12.0, K9))


@L(T123, T123 + 9.0)
def pursuit(ctx, v, t):
    a = fade(t, T123, T123 + 9.0, 0.5, 0.8)
    for pts, d, w in [([(29.8, 38.85), (28.8, 38.6), (27.8, 38.5), (27.18, 38.43)], 0.6, 34),
                      ([(29.9, 39.1), (29.4, 39.6), (29.1, 40.12)], 1.2, 26),
                      ([(29.7, 38.6), (29.0, 38.1), (28.0, 37.85)], 1.6, 24),
                      ([(29.6, 39.2), (28.6, 39.5), (27.9, 39.65)], 2.0, 22)]:
        arrow(ctx, v, pts, ease_io((t - T123 - d) / 5.0), TR, w, a)
    for n, nm, s in [('IZMIR', 'İZMİR', 'l'), ('BURSA', 'BURSA', 'u'), ('USAK', 'UŞAK', 'u'), ('BALIKESIR', 'BALIKESİR', 'u'),
                     ('AYDIN', 'AYDIN', 'd'), ('MANISA', 'MANİSA', 'u')]:
        city(ctx, v, nm, *C[n], a, 26, s)


T124 = T123 + 9.0      # 283.5
cam(T124, 27.2, 38.48, 1.9, 0.3)
cam(T124 + 6.0, 27.15, 38.44, 1.7)
date(T124 + 0.4, '9 EYLÜL 1922')
cap(T124 + 0.6, T124 + 6.2, 'İZMİR KURTULDU', 'Türk süvarileri 9 Eylül 1922\'de İzmir\'e girdi. 18 Eylül\'de Batı Anadolu\'da tek bir işgal askeri kalmamıştı.')


@L(T124, T124 + 6.6)
def izmir_free(ctx, v, t):
    a = fade(t, T124, T124 + 6.6, 0.5, 0.6)
    city(ctx, v, 'İZMİR', *C['IZMIR'], a, 40, 'r')
    arrow(ctx, v, [(27.6, 38.5), (27.35, 38.46), (27.18, 38.43)], ease_io((t - T124 - 0.2) / 1.6), TR, 30, a)
    x, y = v.P(*C['IZMIR'])
    badge(ctx, x - 10, y - 90, 'tr', 44, a, pop_curve((t - T124 - 1.6) / 0.7))
    u = ((t - T124 - 1.6) % 1.6) / 1.6
    if t > T124 + 1.6:
        ctx.set_source_rgba(1, 0.3, 0.3, (1 - u) * a)
        ctx.set_line_width(4)
        ctx.arc(x - 10, y - 90, 44 + 120 * u, 0, 2 * math.pi)
        ctx.stroke()


photo(T124 + 6.6, T124 + 11.0, 'izmir1922b', 'Türk süvarileri İzmir\'e giriyor, 9 Eylül 1922', (0.0, 0.0, 1.0, 0.0), (1.0, 1.1))
photo(T124 + 11.0, T124 + 15.2, 'izmir1922c', 'Türk ordusu İzmir\'de, 9 Eylül 1922', (0.5, 0.2, 0.5, 0.0), (1.0, 1.14))

# ---------- 13. Mudanya, Lozan, Cumhuriyet
T13 = T124 + 15.2      # 298.7
T_MUDANYA = T13 + 1.6
CHAPTERS.append((T13, T13 + 3.4, 'VII', 'ZAFER'))
cam(T13, 27.8, 40.7, 5.6, 0.2)
cam(T13 + 7.0, 28.0, 40.8, 5.6)
date(T13 + 1.0, '11 EKİM 1922')
cap(T13 + 3.4, T13 + 8.0, 'MUDANYA ATEŞKESİ', 'Doğu Trakya ve Edirne, savaşılmadan Türkiye\'ye bırakıldı.')


@L(T13, T13 + 8.6)
def mudanya(ctx, v, t):
    a = fade(t, T13, T13 + 8.6, 0.5, 0.8)
    city(ctx, v, 'MUDANYA', *C['MUDANYA'], a, 30, 'd')
    city(ctx, v, 'EDİRNE', *C['EDIRNE'], a, 28, 'r')
    city(ctx, v, 'İSTANBUL', *C['ISTANBUL'], a, 28, 'u')
    x, y = v.P(*C['EDIRNE'])
    badge(ctx, x + 10, y + 70, 'tr', 30, a, pop_curve((t - T13 - 4.2) / 0.6))


T_LAUS = T13 + 9.4
cam(T13 + 8.6, 35.6, 39.0, 31.0, 0.0)
cam(T13 + 22.0, 35.6, 39.0, 30.0)
date(T13 + 8.8, '1 KASIM 1922')
cap(T13 + 9.0, T13 + 12.0, 'SALTANAT KALDIRILDI', 'TBMM, 1 Kasım 1922\'de saltanatı kaldırdı.')
date(T13 + 12.2, '24 TEMMUZ 1923')
cap(T13 + 12.4, T13 + 18.6, 'LOZAN ANTLAŞMASI',
    'Yeni Türk devletinin bağımsızlığı ve sınırları uluslararası alanda tanındı. Hatay ve Musul meseleleri ileriye bırakıldı.')
date(T13 + 18.8, '6 EKİM 1923')
cap(T13 + 19.0, T13 + 22.0, 'İSTANBUL', 'Son İtilaf birlikleri şehirden ayrıldı.')
T_IST_FREE = T13 + 19.4


@L(T13 + 8.6, 400)
def lausanne_labels(ctx, v, t):
    a = fade(t, T13 + 12.4, 400, 0.8, 0)
    region_label(ctx, v, 'YUNANİSTAN', 22.2, 39.9, a * 0.8, 24, (1, 1, 1), 4)
    region_label(ctx, v, 'BULGARİSTAN', 25.4, 42.75, a * 0.8, 24, (1, 1, 1), 4)
    region_label(ctx, v, 'SOVYETLER BİRLİĞİ', 42.0, 43.6, a * 0.8, 22, (1, 1, 1), 3)
    region_label(ctx, v, 'İRAN', 47.5, 36.2, a * 0.8, 24, (1, 1, 1), 4)
    region_label(ctx, v, 'SURİYE', 38.6, 35.2, a * 0.8, 22, (1, 1, 1), 3, sub='Fransız mandası')
    region_label(ctx, v, 'IRAK', 43.5, 33.6, a * 0.8, 22, (1, 1, 1), 3, sub='İngiliz mandası')
    city(ctx, v, 'ANKARA', *C['ANKARA'], a, 28, 'r', capital=True)
    city(ctx, v, 'İSTANBUL', *C['ISTANBUL'], a, 24, 'u')


photo(T13 + 22.0, T13 + 26.4, 'ist1923', 'Şükrü Naili Paşa komutasındaki Türk birlikleri İstanbul\'a giriyor, Ekim 1923', (0.5, 0.5, 0.5, 0.5), (1.0, 1.1))
T14 = T13 + 26.4
cam(T14, 35.6, 39.0, 30.0)
cam(T14 + 9.0, 35.6, 39.0, 28.5)
date(T14 + 0.2, '29 EKİM 1923')
TITLES.append((T14 + 1.0, T14 + 9.4, 'republic'))
END = T14 + 10.5

# Fransız bölgesinin Hatay'a çekilmesi diplomasi bölümünde: south_zone T_ANKARA_TR'yi kullanır
