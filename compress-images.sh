#!/bin/bash
# compress-images.sh
# Run this script on Mac before committing new images to the site.
# Usage: bash compress-images.sh
# It resizes images wider than 1600px and compresses PNG/JPG files.

set -e

MAX_WIDTH=1600
IMAGES_DIR="$(cd "$(dirname "$0")" && pwd)/images"

if ! command -v sips &>/dev/null; then
  echo "Error: sips not found. This script must run on macOS."
  exit 1
fi

if ! command -v pngquant &>/dev/null; then
  echo "pngquant not found. Installing with Homebrew..."
  brew install pngquant
fi

echo "Scanning images in: $IMAGES_DIR"
echo ""

total_saved=0
count=0

while IFS= read -r -d '' file; do
  ext="${file##*.}"
  ext_lower="${ext,,}"

  orig_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)

  # Step 1: resize if wider than 1600px
  width=$(sips -g pixelWidth "$file" 2>/dev/null | awk '/pixelWidth/ {print $2}')
  if [[ "$width" =~ ^[0-9]+$ ]] && [ "$width" -gt "$MAX_WIDTH" ]; then
    echo "Resizing: $(basename "$file") ($width px wide)"
    sips --resampleWidth "$MAX_WIDTH" "$file" &>/dev/null
  fi

  # Step 2: compress
  if [ "$ext_lower" = "png" ]; then
    pngquant --quality=65-85 --skip-if-larger --force --output "$file" "$file" 2>/dev/null || true

  elif [ "$ext_lower" = "jpg" ] || [ "$ext_lower" = "jpeg" ]; then
    sips -s formatOptions 75 "$file" &>/dev/null
  fi

  new_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
  saved=$(( orig_size - new_size ))
  total_saved=$(( total_saved + saved ))

  if [ "$saved" -gt 1024 ]; then
    echo "  $(basename "$file"): $(( orig_size / 1024 ))KB → $(( new_size / 1024 ))KB (saved $(( saved / 1024 ))KB)"
  fi

  count=$(( count + 1 ))

done < <(find "$IMAGES_DIR" \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) -print0)

echo ""
echo "Done. Processed $count images, saved $(( total_saved / 1024 ))KB total."
echo ""
echo "Next steps:"
echo "  git add images/"
echo "  git commit -m 'Add/update images (compressed)'"
echo "  git push origin main"
