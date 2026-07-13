#!/usr/bin/env node
// Minimal zero-dependency static file server for local development.
// Serves the given root directory (default: cwd) so the demo can load
// its sibling ../src assets. Usage: node scripts/serve.mjs [root]
//
// Includes live-reload over Server-Sent Events: JS/HTML changes trigger a
// full page reload, while CSS changes are hot-swapped in place (no reload,
// so page state is preserved). Both use only Node built-ins.

import { createServer } from 'node:http';
import { createReadStream, watch } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { networkInterfaces } from 'node:os';
import { extname, join, normalize, relative, resolve, sep } from 'node:path';

const root = resolve(process.argv[2] ?? '.');
const port = Number(process.env.PORT) || 3000;

// ANSI colors, disabled when output is piped or NO_COLOR is set.
const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const style = (open, close) => s => (useColor ? `\x1b[${open}m${s}\x1b[${close}m` : s);
const bold = style(1, 22);
const dim = style(2, 22);
const green = style(32, 39);
const cyan = style(36, 39);
const yellow = style(33, 39);
const red = style(31, 39);

// Log one line per request once the response is done, colored by status.
const logRequest = (req, res, start) => {
  const status = res.statusCode;
  const color = status >= 500 ? red : status >= 400 ? yellow : status >= 300 ? cyan : green;
  console.log(`  ${dim(req.method)} ${color(status)} ${req.url} ${dim(`${Date.now() - start}ms`)}`);
};

// First non-internal IPv4 address, for the Network URL.
const lanAddress = () =>
  Object.values(networkInterfaces())
    .flat()
    .find(n => n?.family === 'IPv4' && !n.internal)?.address;

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
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

// --- Live-reload client, injected into every served HTML page. ---
const RELOAD_PATH = '/__livereload';
const CLIENT_SNIPPET = `<script>
(() => {
  const es = new EventSource(${JSON.stringify(RELOAD_PATH)});
  es.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.type !== 'css') return location.reload();
    // Hot-swap the matching stylesheet without reloading the page.
    let swapped = false;
    for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
      const href = new URL(link.href, location.href);
      if (href.pathname !== msg.path) continue;
      href.searchParams.set('t', Date.now());
      const next = link.cloneNode();
      next.href = href.href;
      next.onload = next.onerror = () => link.remove();
      link.parentNode.insertBefore(next, link.nextSibling);
      swapped = true;
    }
    if (!swapped) location.reload();
  };
})();
</script>`;

const injectClient = html =>
  html.includes('</body>')
    ? html.replace('</body>', `${CLIENT_SNIPPET}</body>`)
    : html + CLIENT_SNIPPET;

// --- Server-Sent Events: track open clients and broadcast reload events. ---
const clients = new Set();

const notify = data => {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  for (const res of clients) res.write(payload);
};

const send = (res, status, body) => {
  res.writeHead(status, { 'content-type': 'text/plain; charset=utf-8' });
  res.end(body);
};

const server = createServer(async (req, res) => {
  const start = Date.now();

  try {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);

    // Live-reload event stream: keep the connection open for broadcasts.
    if (urlPath === RELOAD_PATH) {
      res.writeHead(200, {
        'content-type': 'text/event-stream',
        'cache-control': 'no-cache',
        connection: 'keep-alive',
      });
      res.write('retry: 1000\n\n');
      clients.add(res);
      req.on('close', () => clients.delete(res));
      return;
    }

    // Resolve within root and reject any path that escapes it.
    let filePath = normalize(join(root, urlPath));
    if (filePath !== root && !filePath.startsWith(root + sep)) {
      return send(res, 403, 'Forbidden');
    }

    let info = await stat(filePath).catch(() => null);
    if (info?.isDirectory()) {
      filePath = join(filePath, 'index.html');
      info = await stat(filePath).catch(() => null);
    }
    if (!info?.isFile()) return send(res, 404, 'Not Found');

    const type = MIME[extname(filePath).toLowerCase()] ?? 'application/octet-stream';

    // Inject the live-reload client into HTML; stream everything else.
    // Only HTML page loads are logged (not every asset request).
    if (type.startsWith('text/html')) {
      const body = injectClient(await readFile(filePath, 'utf8'));
      res.writeHead(200, {
        'content-type': type,
        'cache-control': 'no-cache',
        'content-length': Buffer.byteLength(body),
      });
      res.on('finish', () => logRequest(req, res, start));
      return res.end(body);
    }

    res.writeHead(200, { 'content-type': type, 'cache-control': 'no-cache' });
    createReadStream(filePath).pipe(res);
  } catch {
    send(res, 500, 'Internal Server Error');
  }
});

// --- Watch source directories and debounce change events. ---
function startWatching() {
  // Watch only relevant dirs so we don't crawl node_modules/.git.
  const candidates = ['demo', 'src'];
  const pending = new Set();
  let timer = null;

  const flush = () => {
    timer = null;
    const changed = [...pending];
    pending.clear();
    // If anything other than CSS changed, a full reload is required.
    if (changed.some(p => !p.endsWith('.css'))) return notify({ type: 'reload' });
    for (const path of changed) notify({ type: 'css', path });
  };

  const onChange = (dir, filename) => {
    if (!filename) return notify({ type: 'reload' });
    // Build a root-absolute URL path (forward slashes) for the client.
    pending.add('/' + join(dir, filename).split(sep).join('/'));
    clearTimeout(timer);
    timer = setTimeout(flush, 50);
  };

  for (const dir of candidates) {
    const abs = join(root, dir);
    try {
      watch(abs, { recursive: true }, (_event, filename) =>
        onChange(relative(root, abs), filename)
      );
    } catch {
      // Directory missing — skip it.
    }
  }
}

server.listen(port, async () => {
  startWatching();

  const path = (await stat(join(root, 'demo', 'index.html')).then(
    () => true,
    () => false
  ))
    ? '/demo/'
    : '/';
  const arrow = green('➜');
  const link = host => cyan(`http://${host}:${bold(port)}${path}`);
  const network = lanAddress();

  console.log();
  console.log(`  ${green(bold('flex-gallery'))} ${dim('dev server ready')}`);
  console.log();
  console.log(`  ${arrow}  ${bold('Local:')}    ${link('localhost')}`);
  console.log(`  ${arrow}  ${bold('Network:')}  ${network ? link(network) : dim('unavailable')}`);
  console.log();
  console.log(dim('  Live-reload on, CSS hot-swapped in place'));
  console.log(dim('  Press Ctrl+C to stop'));
  console.log();
});
