// Sastra Solution — static web server with SPA fallback + /api proxy
// Serves dist/apps/gauzy on 4200; any non-file path falls back to index.html.
// Injects a secure-context polyfill (crypto.randomUUID/getRandomValues) into
// index.html — these APIs are missing on plain http:// when accessed from
// another device via LAN IP (browsers only enable them on https or localhost).
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../dist/apps/gauzy');
const PORT = 4200;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json'
};

const POLYFILL = '<script id="sastra-polyfill">(function(){try{var c=window.crypto||window.msCrypto;if(!c){window.crypto=c={};}if(!c.getRandomValues){c.getRandomValues=function(a){for(var i=0;i<a.length;i++){a[i]=Math.floor(Math.random()*4294967296);}return a;};}if(typeof c.randomUUID!=="function"){c.randomUUID=function(){var b=new Uint8Array(16);c.getRandomValues(b);b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;var h=[];for(var i=0;i<16;i++){h.push((b[i]+256).toString(16).substr(1));}return h.slice(0,4).join("")+"-"+h.slice(4,6).join("")+"-"+h.slice(6,8).join("")+"-"+h.slice(8,10).join("")+"-"+h.slice(10,16).join("");};}}catch(e){console.warn("polyfill failed",e);}})();</script>';

function serveIndexHtml(res) {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
  let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
  if (!html.includes('sastra-polyfill')) {
    html = html.replace('<head>', '<head>' + POLYFILL);
  }
  res.end(html);
}

const server = http.createServer((req, res) => {
  try {
    let urlPath = decodeURIComponent(req.url.split('?')[0]);

    // /api/* -> proxy to the API on 127.0.0.1:3000
    if (urlPath === '/api' || urlPath.startsWith('/api/')) {
      const proxyReq = http.request({
        host: '127.0.0.1', port: 3000,
        path: req.url,
        method: req.method,
        headers: { ...req.headers, host: '127.0.0.1:3000' }
      }, (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
        proxyRes.pipe(res);
      });
      proxyReq.on('error', (e) => {
        if (!res.headersSent) res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'API unreachable: ' + e.message }));
      });
      req.pipe(proxyReq);
      return;
    }

    let filePath = path.join(ROOT, urlPath);
    // prevent path traversal
    if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end('Forbidden'); return; }

    fs.stat(filePath, (err, stat) => {
      try {
        if (!err && stat.isFile()) {
          if (path.basename(filePath) === 'index.html') return serveIndexHtml(res);
          res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
          return fs.createReadStream(filePath).pipe(res);
        }
        // SPA fallback (unknown route or directory) -> index.html
        return serveIndexHtml(res);
      } catch (e) {
        if (!res.headersSent) res.writeHead(500);
        res.end('Error');
      }
    });
  } catch (e) {
    if (!res.headersSent) res.writeHead(500);
    res.end('Error');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('Sastra web serving ' + ROOT + ' on http://0.0.0.0:' + PORT);
});
