// Zero-dependency dev server for Ministry of Truth.
// Run with `npm run dev` (needs Node installed). No `npm install` required.
const http = require("http");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const PORT = process.env.PORT || 5173;
const ROOT = __dirname;
const ENTRY = "ministry-of-truth.html";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
  // Map "/" to the game, otherwise serve the requested file from this folder.
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/" + ENTRY;

  // Keep requests inside this directory.
  const filePath = path.join(ROOT, path.normalize(urlPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" }).end("404 Not Found");
      return;
    }
    const type = MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type }).end(data);
  });
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}/`;
  console.log(`\n  Ministry of Truth is running at:  ${url}\n  Press Ctrl+C to stop.\n`);
  // Best-effort: open the default browser, but only when launched from an
  // interactive terminal (skips the in-app preview, which has its own pane).
  if (process.stdout.isTTY) {
    try { execSync(`open "${url}"`); } catch (_) {}
  }
});
