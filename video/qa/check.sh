#!/usr/bin/env bash
# Technical check of finished videos: specs, a full decode (any error = damaged
# file), frame count, loudness and true peak.
#   ./qa/check.sh out/*.mp4
set -uo pipefail
for f in "$@"; do
  spec=$(ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate,pix_fmt,sample_rate,channels -of csv=p=0 "$f" | tr '\n' ' ')
  errors=$(ffmpeg -v error -i "$f" -f null - 2>&1 | wc -l)
  frames=$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 "$f")
  loud=$(ffmpeg -hide_banner -nostats -i "$f" -af ebur128=peak=true -f null - 2>&1 | awk '/^ +I:/{i=$2} /^ +Peak:/{p=$2} END{print i " LUFS, true peak " p " dBFS"}')
  printf '%s\n  %s\n  frames %s, decode errors %s, %s\n' "$f" "$spec" "$frames" "$errors" "$loud"
done
