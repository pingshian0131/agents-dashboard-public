import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleMemoryApi } from './memoryApi.js';
import { handleWorkspaceApi } from './workspaceApi.js';
import { handleSkillsApi } from './skillsApi.js';

const PORT = parseInt(process.env.PORT ?? '3001', 10);
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST_DIR = process.env.DIST_DIR || join(__dirname, '..', 'dist');

const MIME: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function cors(res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function serveStatic(res: ServerResponse, filePath: string): Promise<boolean> {
  try {
    const s = await stat(filePath);
    if (!s.isFile()) return false;
    const data = await readFile(filePath);
    const ext = extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
    return true;
  } catch {
    return false;
  }
}

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  cors(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

  // API routes
  if (url.pathname.startsWith('/api/')) {
    try {
      const handled = await handleMemoryApi(req, res) || await handleWorkspaceApi(req, res) || await handleSkillsApi(req, res);
      if (!handled) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'not found' }));
      }
    } catch (e: any) {
      console.error('API error:', e);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message ?? 'internal error' }));
    }
    return;
  }

  // Static files
  const filePath = join(DIST_DIR, url.pathname === '/' ? 'index.html' : url.pathname);
  if (await serveStatic(res, filePath)) return;

  // SPA fallback
  await serveStatic(res, join(DIST_DIR, 'index.html'));
});

server.listen(PORT, '0.0.0.0', () => {
  const demo = process.env.DEMO_MODE === 'true';
  console.log(`Memory Dashboard running on http://0.0.0.0:${PORT}${demo ? ' [DEMO MODE]' : ''}`);
});
