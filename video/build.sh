#!/usr/bin/env bash
# Builds every version of the VELMO film into out/ (see README.md).
#   ./build.sh            all four masters + web versions + posters
#   ./build.sh tr 16x9    a single master
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p out

[ -f out/velmo-mix.wav ] || python3 music.py out/velmo-mix.wav
# Loudness for web and social: −13 LUFS integrated.
if [ ! -f out/velmo-audio.wav ]; then
  I=$(ffmpeg -hide_banner -nostats -i out/velmo-mix.wav -af ebur128 -f null - 2>&1 | awk '/^ +I:/{print $2}' | tail -1)
  ffmpeg -hide_banner -loglevel error -y -i out/velmo-mix.wav -af "volume=$(python3 -c "print(-13-($I))")dB" -c:a pcm_s24le out/velmo-audio.wav
fi

render() { # lang ratio
  local w=1920 h=1080
  [ "$2" = 9x16 ] && w=1080 h=1920
  node render.js --lang "$1" --w $w --h $h --sub "${SUB:-6}" --crf 18 --audio out/velmo-audio.wav --out "out/velmo-$1-$2.mp4"
}

if [ $# -eq 2 ]; then render "$1" "$2"; exit; fi
for l in tr en; do for r in 16x9 9x16; do [ -f "out/velmo-$l-$r.mp4" ] || render $l $r; done; done

# Web versions (lighter) and posters (the end card) for the site.
for l in tr en; do
  ffmpeg -hide_banner -loglevel error -y -i out/velmo-$l-16x9.mp4 -c:v libx264 -preset slow -crf 22 -profile:v high -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -movflags +faststart -c:a aac -b:a 160k out/web-$l-16x9.mp4
  ffmpeg -hide_banner -loglevel error -y -i out/velmo-$l-9x16.mp4 -vf scale=720:-2 -c:v libx264 -preset slow -crf 22 -profile:v high -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -movflags +faststart -c:a aac -b:a 160k out/web-$l-9x16.mp4
  ffmpeg -hide_banner -loglevel error -y -i out/velmo-$l-16x9.mp4 -c:v libvpx-vp9 -b:v 0 -crf 33 -row-mt 1 -deadline good -cpu-used 2 -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:a libopus -b:a 128k out/web-$l-16x9.webm
  ffmpeg -hide_banner -loglevel error -y -i out/velmo-$l-9x16.mp4 -vf scale=720:-2 -c:v libvpx-vp9 -b:v 0 -crf 33 -row-mt 1 -deadline good -cpu-used 2 -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:a libopus -b:a 128k out/web-$l-9x16.webm
  ffmpeg -hide_banner -loglevel error -y -ss 23.2 -i out/velmo-$l-16x9.mp4 -frames:v 1 -vf scale=1280:-2 -q:v 3 out/poster-$l-16x9.jpg
  ffmpeg -hide_banner -loglevel error -y -ss 23.2 -i out/velmo-$l-9x16.mp4 -frames:v 1 -vf scale=720:-2 -q:v 3 out/poster-$l-9x16.jpg
done
# Copy the web versions and posters into the site.
mkdir -p ../public/video
for l in tr en; do for r in 16x9 9x16; do
  cp out/web-$l-$r.mp4 ../public/video/velmo-$l-$r.mp4
  cp out/web-$l-$r.webm ../public/video/velmo-$l-$r.webm
  cp out/poster-$l-$r.jpg ../public/video/velmo-$l-$r.jpg
done; done
ls -la out ../public/video
