#!/usr/bin/env node
// Local preview for fed-agent.github.io with a Full / Tablet / Phone device frame.
//
// Serves the built site (../../dist) AND a thin wrapper UI from a single origin,
// so every root-absolute asset the site uses (/logo*.png, /_astro/*,
// fetch('/data/*.json'), /figures/*) resolves untouched. Zero dependencies.
//
//   npm run build            # produce dist/
//   npm run preview:device   # then open the framed URL it prints
//
// The wrapper lives at /_preview ; everything else is served from dist/.
// Override the port with  PORT=9000 npm run preview:device

import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, normalize, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url)); // tools/preview/
const REPO = normalize(join(HERE, '..', '..')); // repo root
const DIST = join(REPO, 'dist');
const WRAPPER = join(HERE, 'index.html');
const PORT = Number(process.env.PORT || 8086);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.pdf': 'application/pdf',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.wasm': 'application/wasm',
};

async function tryFile(p) {
  try {
    const s = await stat(p);
    return s.isFile() ? p : null;
  } catch {
    return null;
  }
}

// Resolve a URL path to a file inside dist/, with directory-index and
// extensionless fallbacks. Returns null on miss or traversal attempt.
async function resolveInDist(urlPath) {
  let pathname;
  try {
    pathname = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  } catch {
    pathname = urlPath.split('?')[0];
  }
  const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  const abs = normalize(join(DIST, safe));
  if (abs !== DIST && !abs.startsWith(DIST + sep)) return null; // escape attempt
  if (pathname.endsWith('/')) return tryFile(join(abs, 'index.html'));
  return (
    (await tryFile(abs)) ||
    (await tryFile(abs + '.html')) ||
    (await tryFile(join(abs, 'index.html')))
  );
}

const server = http.createServer(async (req, res) => {
  const url = req.url || '/';

  // The framed wrapper UI (its own path so it never shadows a dist file).
  if (url === '/_preview' || url === '/_preview/' || url.startsWith('/_preview?')) {
    try {
      const body = await readFile(WRAPPER);
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
      res.end(body);
    } catch {
      res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('preview wrapper (index.html) missing');
    }
    return;
  }

  const file = await resolveInDist(url);
  if (!file) {
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    res.end(`<h1>404</h1><p>${url} not found in dist/. Did you run <code>npm run build</code> first?</p>`);
    return;
  }
  try {
    const body = await readFile(file);
    const type = MIME[extname(file).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, {
      'content-type': type,
      'cache-control': 'no-store, no-cache, must-revalidate, max-age=0',
    });
    res.end(body);
  } catch (err) {
    res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('500: ' + err.message);
  }
});

const distOk = await tryFile(join(DIST, 'index.html'));
server.listen(PORT, () => {
  console.log('\n  FedAgent local preview');
  console.log('  ----------------------');
  if (!distOk) console.log('  !  dist/ not found — run `npm run build` first, then reload.\n');
  console.log(`  raw     http://localhost:${PORT}/`);
  console.log(`  framed  http://localhost:${PORT}/_preview   <- open this (Full / Tablet / Phone)`);
  console.log('\n  Ctrl-C to stop.\n');
});
