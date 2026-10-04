#!/usr/bin/env bash
# End-to-end build of the Socialp Media brand film.
#   ./scripts/build.sh            → video/socialp-media-16x9.mp4 + video/socialp-media-9x16.mp4
#   FORMATS="h" ./scripts/build.sh → landscape only
set -euo pipefail
cd "$(dirname "$0")/.."

FORMATS="${FORMATS:-h v}"
VBITRATE="${VBITRATE:-6000k}"
mkdir -p build video

# 1 · source frames for the Dlux Professional browser mockup (1.5× speed in the edit)
if [ ! -f src/assets/dlux/f270.jpg ]; then
  mkdir -p src/assets/dlux
  ffmpeg -v error -y -ss 0 -t 9 -i src/assets/dlux-professional-web.mp4 -vf fps=30 -q:v 2 src/assets/dlux/f%03d.jpg
fi

# 2 · score (synthesized, frame-synced to the timeline)
python3 scripts/score.py build/score.wav

# loudness: measure, then bring to -14 LUFS with a -1 dBTP ceiling (streaming/social standard)
I=$(ffmpeg -nostats -i build/score.wav -af ebur128 -f null - 2>&1 | awk '/Integrated loudness/{f=1} f&&/I:/{print $2; exit}')
GAIN=$(python3 -c "print(round(-14.0 - float('$I'), 2))")
echo "score loudness ${I} LUFS → gain ${GAIN} dB"
ffmpeg -v error -y -i build/score.wav -af "volume=${GAIN}dB,alimiter=limit=0.891:attack=2:release=60:level=disabled" -ar 48000 build/score-master.wav

for F in $FORMATS; do
  if [ "$F" = "v" ]; then NAME=9x16; else NAME=16x9; fi
  # 3 · picture: 4 motion-blur samples per frame, 3 parallel workers
  node scripts/render.js --format "$F" --workers "${WORKERS:-3}" --out "build/master-$F.mkv"

  # 4 · finishing: fine luma grain, 4:2:0, two-pass H.264, AAC
  VF="noise=c0s=3:c0f=t,format=yuv420p"
  ffmpeg -v error -y -i "build/master-$F.mkv" -vf "$VF" -c:v libx264 -preset slow -b:v "$VBITRATE" -pass 1 -passlogfile "build/x264-$F" -an -f null /dev/null
  ffmpeg -v error -y -i "build/master-$F.mkv" -i build/score-master.wav -map 0:v -map 1:a -vf "$VF" \
    -c:v libx264 -preset slow -b:v "$VBITRATE" -maxrate 9000k -bufsize 12000k -pass 2 -passlogfile "build/x264-$F" \
    -profile:v high -level 4.2 -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
    -c:a aac -b:a 256k -shortest -movflags +faststart \
    -metadata title="Socialp Media — Dijital çözüm ortağınız" "video/socialp-media-$NAME.mp4"
  echo "✓ video/socialp-media-$NAME.mp4"
done
