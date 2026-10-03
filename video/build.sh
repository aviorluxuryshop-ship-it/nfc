#!/usr/bin/env bash
# Builds every version of a VELMO film into out/ (see README.md).
#   ./build.sh                    brand film: all four masters + web versions + posters (copied into the site)
#   ./build.sh tr 16x9            a single master
#   FILM=usage ./build.sh         the usage film (usage.html + music_usage.py), out/velmo-kullanim-*
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p out

FILM=${FILM:-film}
case "$FILM" in
  film)  PAGE=film.html;  MUSIC=music.py;       NAME=velmo;          POSTER_AT=23.2 ;;
  usage) PAGE=usage.html; MUSIC=music_usage.py; NAME=velmo-kullanim; POSTER_AT=23.7 ;;
  *) echo "unknown FILM=$FILM (film|usage)" >&2; exit 1 ;;
esac
WEB=${NAME/velmo/web}
POSTER=${NAME/velmo/poster}

[ -f out/$NAME-mix.wav ] || python3 $MUSIC out/$NAME-mix.wav
# Loudness for web and social: −13 LUFS integrated.
if [ ! -f out/$NAME-audio.wav ]; then
  I=$(ffmpeg -hide_banner -nostats -i out/$NAME-mix.wav -af ebur128 -f null - 2>&1 | awk '/^ +I:/{print $2}' | tail -1)
  ffmpeg -hide_banner -loglevel error -y -i out/$NAME-mix.wav -af "volume=$(python3 -c "print(-13-($I))")dB" -c:a pcm_s24le out/$NAME-audio.wav
fi

render() { # lang ratio
  local w=1920 h=1080
  [ "$2" = 9x16 ] && w=1080 h=1920
  node render.js --page $PAGE --lang "$1" --w $w --h $h --sub "${SUB:-6}" --crf 18 --audio out/$NAME-audio.wav --out "out/$NAME-$1-$2.mp4"
}

if [ $# -eq 2 ]; then render "$1" "$2"; exit; fi
for l in tr en; do for r in 16x9 9x16; do [ -f "out/$NAME-$l-$r.mp4" ] || render $l $r; done; done

# Web versions (lighter) and posters (the end card) for the site.
for l in tr en; do
  ffmpeg -hide_banner -loglevel error -y -i out/$NAME-$l-16x9.mp4 -c:v libx264 -preset slow -crf 22 -profile:v high -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -movflags +faststart -c:a aac -b:a 160k out/$WEB-$l-16x9.mp4
  ffmpeg -hide_banner -loglevel error -y -i out/$NAME-$l-9x16.mp4 -c:v libx264 -preset slow -crf 22 -profile:v high -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -movflags +faststart -c:a aac -b:a 160k out/$WEB-$l-9x16.mp4
  ffmpeg -hide_banner -loglevel error -y -i out/$NAME-$l-16x9.mp4 -c:v libvpx-vp9 -b:v 0 -crf 33 -row-mt 1 -deadline good -cpu-used 2 -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:a libopus -b:a 128k out/$WEB-$l-16x9.webm
  ffmpeg -hide_banner -loglevel error -y -i out/$NAME-$l-9x16.mp4 -c:v libvpx-vp9 -b:v 0 -crf 33 -row-mt 1 -deadline good -cpu-used 2 -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:a libopus -b:a 128k out/$WEB-$l-9x16.webm
  ffmpeg -hide_banner -loglevel error -y -ss $POSTER_AT -i out/$NAME-$l-16x9.mp4 -frames:v 1 -vf scale=1280:-2 -q:v 3 out/$POSTER-$l-16x9.jpg
  ffmpeg -hide_banner -loglevel error -y -ss $POSTER_AT -i out/$NAME-$l-9x16.mp4 -frames:v 1 -vf scale=720:-2 -q:v 3 out/$POSTER-$l-9x16.jpg
done
# Copy the web versions and posters into the site (the brand film is the one the site plays).
if [ "$FILM" = film ]; then
  mkdir -p ../public/video
  for l in tr en; do for r in 16x9 9x16; do
    cp out/$WEB-$l-$r.mp4 ../public/video/$NAME-$l-$r.mp4
    cp out/$WEB-$l-$r.webm ../public/video/$NAME-$l-$r.webm
    cp out/$POSTER-$l-$r.jpg ../public/video/$NAME-$l-$r.jpg
  done; done
  ls -la ../public/video
fi
ls -la out
