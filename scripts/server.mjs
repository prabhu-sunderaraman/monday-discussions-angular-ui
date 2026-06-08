// Dev mock API: json-server (v1) + a routes.json rewriter it no longer ships with.
// json-server 1.x dropped CLI support for custom routes, so this thin wrapper
// applies the rewrites from routes.json before handing the request to its app.
//
// Run with: npm run db   (or: node scripts/server.mjs)

import { existsSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { createApp } from 'json-server/lib/app.js';
import { NormalizedAdapter } from 'json-server/lib/adapters/normalized-adapter.js';
import { Observer } from 'json-server/lib/adapters/observer.js';

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? 'localhost';
const MAX_REWRITE_PASSES = 5;

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dbFile = join(root, 'db.json');
const routesFile = join(root, 'routes.json');

function loadRoutes(path) {
  if (!existsSync(path)) {
    return {};
  }
  return JSON.parse(readFileSync(path, 'utf8'));
}

function mergeQuery(target, incomingQuery) {
  if (!incomingQuery) {
    return target;
  }
  return target.includes('?') ? `${target}&${incomingQuery}` : `${target}?${incomingQuery}`;
}

// Apply a single matching rule. Supports a trailing `/*` wildcard captured as $1,
// and exact-path rules (which may carry their own query string).
function applyOnce(url, routes) {
  const [pathname, query = ''] = url.split('?');

  for (const [pattern, target] of Object.entries(routes)) {
    if (pattern.endsWith('/*')) {
      const base = pattern.slice(0, -2);
      if (pathname === base || pathname.startsWith(`${base}/`)) {
        const rest = pathname.slice(base.length).replace(/^\//, '');
        return mergeQuery(target.replace('$1', rest), query);
      }
    } else if (pathname === pattern.split('?')[0]) {
      return mergeQuery(target, query);
    }
  }
  return url;
}

// Rewrites can chain (e.g. /api/policies/flagged -> /policies/flagged -> /policies?...),
// so apply repeatedly until stable, capped to avoid loops.
function rewrite(url, routes) {
  let current = url;
  for (let i = 0; i < MAX_REWRITE_PASSES; i += 1) {
    const next = applyOnce(current, routes);
    if (next === current) {
      break;
    }
    current = next;
  }
  return current;
}

async function main() {
  if (!existsSync(dbFile)) {
    console.error(`db.json not found at ${dbFile}. Run "npm run seed" first.`);
    process.exit(1);
  }

  const routes = loadRoutes(routesFile);
  const db = new Low(new Observer(new NormalizedAdapter(new JSONFile(dbFile))), {});
  await db.read();

  const app = createApp(db, { logger: false, static: [] });

  const server = createServer((req, res) => {
    if (req.url) {
      const rewritten = rewrite(req.url, routes);
      if (rewritten !== req.url) {
        console.log(`${req.method} ${req.url} -> ${rewritten}`);
        req.url = rewritten;
      }
    }
    app.handler(req, res);
  });

  server.listen(PORT, HOST, () => {
    console.log(`Mock API running at http://${HOST}:${PORT}`);
    console.log(`  data:   ${dbFile}`);
    console.log(`  routes: ${Object.keys(routes).length ? routesFile : '(none)'}`);
    console.log('  e.g.    GET /api/policies   /api/policies/flagged   /api/policies/active');
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
