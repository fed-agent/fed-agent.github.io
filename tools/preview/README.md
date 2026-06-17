# Local preview (device frame)

A zero-dependency local previewer for this site, with **Full / Tablet / Phone**
width toggles — handy for checking the hero, charts, and responsive layout the
way they actually render in production (the built `dist/`, not the dev server).

## Use

```bash
npm run build          # produce dist/
npm run preview:device # start the previewer
```

Then open the **framed** URL it prints:

```
http://localhost:8086/_preview     # Full / Tablet / Phone frame
http://localhost:8086/             # the raw built site
```

Change the port with `PORT=9000 npm run preview:device`.

## How it works

`serve.mjs` serves the repo's `dist/` at the origin root (so root-absolute
assets like `/_astro/*`, `/logo*.png`, `/figures/*`, and `fetch('/data/*.json')`
resolve untouched) and the device-frame wrapper at `/_preview`. Because both come
from one origin, the iframe loads the real site with no path rewriting.

This is a dev tool only: it is not part of the site and is never deployed (the
GitHub Pages Action builds `src/ → dist/` and ignores `tools/`).
