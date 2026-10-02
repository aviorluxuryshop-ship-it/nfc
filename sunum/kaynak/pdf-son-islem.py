"""Chromium'un ürettiği PDF'e yer imleri, belge bilgileri ve dil etiketi ekler.

Kullanım: python3 pdf-son-islem.py ../Neden-Socialp-Media.pdf   (pikepdf gerekir)
"""
import sys
from datetime import datetime, timezone

import pikepdf
from pikepdf import Name, OutlineItem

BOOKMARKS = [
    'Kapak — Neden Socialp Media?',
    'Yaklaşımımız',
    'Yedi fark, tek bir ortaklık',
    '01 — Profesyonel Reklam Yönetimi',
    '02 — Şeffaf Raporlama',
    '03 — İşletmenize Özel Çözümler',
    '04 — Profesyonel Çekim & İçerik Üretimi',
    '05 — Esnek İş Birliği',
    '06 — Sürekli Danışmanlık & Stratejik Destek',
    '07 — Tek Noktadan Dijital Çözüm',
    'Socialp Media ile çalışma yaklaşımı',
    'İletişim',
]

path = sys.argv[1]
with pikepdf.open(path, allow_overwriting_input=True) as pdf:
    if len(pdf.pages) != len(BOOKMARKS):
        sys.exit(f'Beklenen {len(BOOKMARKS)} sayfa, bulunan {len(pdf.pages)}')

    with pdf.open_outline() as outline:
        outline.root.clear()
        for i, title in enumerate(BOOKMARKS):
            outline.root.append(OutlineItem(title, i))

    now = datetime.now(timezone.utc)
    with pdf.open_metadata(set_pikepdf_as_editor=False) as meta:
        meta['dc:title'] = 'Neden Socialp Media?'
        meta['dc:creator'] = ['Socialp Media']
        meta['dc:description'] = 'Socialp Media ile çalışmanın farkı: teklif dosyası eki sunum.'
        meta['dc:language'] = ['tr-TR']
        meta['pdf:Keywords'] = 'Socialp Media, sosyal medya ajansı, dijital ajans, Meta reklamları, Google reklamları, İstanbul'
        meta['xmp:CreatorTool'] = 'Socialp Media'
        meta['xmp:ModifyDate'] = now.isoformat()

    pdf.docinfo[Name.Title] = 'Neden Socialp Media?'
    pdf.docinfo[Name.Author] = 'Socialp Media'
    pdf.docinfo[Name.Subject] = 'Socialp Media ile çalışmanın farkı: teklif dosyası eki sunum.'
    pdf.docinfo[Name.Keywords] = 'Socialp Media, sosyal medya ajansı, dijital ajans, Meta reklamları, Google reklamları, İstanbul'
    pdf.docinfo[Name.Creator] = 'Socialp Media'

    pdf.Root.Lang = pikepdf.String('tr-TR')
    pdf.Root.PageMode = Name.UseNone
    pdf.Root.ViewerPreferences = pikepdf.Dictionary(DisplayDocTitle=True)
    pdf.save(path)
print('PDF son işlem tamam:', path)
