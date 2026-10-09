# Demo asset placeholder

This directory will hold `demo.gif` — a <15s animated walkthrough of MeritOS
(home → profile → open the Proof Sandbox → verify a credential → export a badge).

Recording recipe (macOS):

```bash
# 1. Record ~15s at 1280x800 while demoing http://localhost:3000
#    (Shift+Cmd+5, or use `asciinema`/`kap`/`ScreenToGif`).
# 2. Convert to an optimized GIF:
ffmpeg -i demo.mov -vf "fps=12,scale=1280:-1:flags=lanczos,palettegen=max_colors=128" -y palette.png
ffmpeg -i demo.mov -i palette.png -lavfi "fps=12,scale=1280:-1:flags=lanczos[x];[x][1:v]paletteuse" -y demo.gif
# 3. Move into place:
mv demo.gif docs/assets/demo.gif
```

The README references `docs/assets/demo.gif` directly. Once added, the image
renders in the "What it looks like" section.
