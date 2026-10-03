"""
Contact sheets for reviewing a rendered video frame by frame.

    python3 qa/sheets.py out/velmo-tr-16x9.mp4 [--fps 2] [--out out/review]

Writes <out>/<name>_N.png, each a grid of frames labelled with their time.
"""
import argparse
import glob
import os
import subprocess
import tempfile

from PIL import Image, ImageDraw

ap = argparse.ArgumentParser()
ap.add_argument('video')
ap.add_argument('--fps', type=float, default=2)
ap.add_argument('--out', default='out/review')
a = ap.parse_args()

name = os.path.splitext(os.path.basename(a.video))[0]
os.makedirs(a.out, exist_ok=True)
w, h = map(int, subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', a.video]).decode().strip().split(','))
vertical = h > w
with tempfile.TemporaryDirectory() as tmp:
    scale = 'scale=-2:480' if vertical else 'scale=480:-2'
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', a.video, '-vf', f'fps={a.fps},{scale}', f'{tmp}/f%04d.png'], check=True)
    frames = sorted(glob.glob(f'{tmp}/*.png'))
    fw, fh = Image.open(frames[0]).size
    cols = 8 if vertical else 4
    per = cols * (2 if vertical else 4)
    for part in range(0, len(frames), per):
        chunk = frames[part:part + per]
        rows = (len(chunk) + cols - 1) // cols
        sheet = Image.new('RGB', (cols * (fw + 4), rows * (fh + 16)), 'white')
        draw = ImageDraw.Draw(sheet)
        for i, f in enumerate(chunk):
            x, y = (i % cols) * (fw + 4), (i // cols) * (fh + 16)
            sheet.paste(Image.open(f), (x, y + 14))
            draw.text((x + 2, y + 1), f'{(part + i) / a.fps:.1f}s', fill='black')
        out = os.path.join(a.out, f'{name}_{part // per}.png')
        sheet.save(out)
        print(out)
