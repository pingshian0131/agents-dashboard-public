[繁體中文](./README.zh-TW.md) | **English**

# OpenClaw Dashboard

A web-based dashboard for managing LanceDB vector memories — browse, search, edit memories, manage workspace files, and explore skills.

**Live Demo: [demo-memory-dashboard.simple-web.cc](https://demo-memory-dashboard.simple-web.cc/)**

## Features

- **Memory Browser** — Filter by scope / category, full-text search
- **Memory CRUD** — Create, edit, delete memories with auto-generated embeddings
- **Workspace Manager** — View and edit standard workspace files (MEMORY.md, IDENTITY.md, etc.)
- **Skills Dashboard** — Browse skills across global, shared, and agent-level sources
- **Stats Dashboard** — Memory counts by scope and category
- **Demo Mode** — Built-in sample data, no external dependencies required

## Quick Start — Demo Mode

No LanceDB or OpenAI API key needed. Try the full UI instantly:

```bash
npm install
npm run build
DEMO_MODE=true npm run server
# → http://localhost:3001
```

### Docker (Demo Mode)

```bash
docker build -t memory-dashboard .
docker run -p 3001:3001 -e DEMO_MODE=true memory-dashboard
```

## Production Usage

Connect to a real LanceDB database:

```bash
npm install
npm run build
OPENAI_API_KEY=your-key-here \
  MEMORY_DB_PATH=/path/to/lancedb \
  WORKSPACE_DIR=/path/to/workspaces \
  npm run server
```

### Docker (Production)

```bash
docker build -t memory-dashboard .
docker run -p 3001:3001 \
  -v /path/to/workspaces:/data/workspaces \
  -v /path/to/memory-db:/data/memory-db \
  -e OPENAI_API_KEY=your-key-here \
  memory-dashboard
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DEMO_MODE` | `false` | Enable demo mode (in-memory sample data) |
| `PORT` | `3001` | Server listen port |
| `DIST_DIR` | `../dist` | Frontend static files directory |
| `WORKSPACE_DIR` | `/data/workspaces` | Workspace root directory |
| `MEMORY_DB_PATH` | `/data/memory-db` | LanceDB database path |
| `MEMORY_TABLE_NAME` | `memories` | LanceDB table name |
| `EMBEDDING_MODEL` | `text-embedding-3-small` | OpenAI embedding model |
| `OPENAI_API_KEY` | — | OpenAI API key (required in non-demo mode) |
| `SKILLS_DIR` | `~/.claude/skills` | Global skills directory |

## Tech Stack

- **Frontend**: React 19 + Vite 6 + TypeScript
- **Backend**: Node.js native HTTP server (no framework)
- **Database**: LanceDB (vector search)
- **Embeddings**: OpenAI `text-embedding-3-small`

## Development

```bash
npm run dev    # Frontend dev server (proxy /api → localhost:3001)
npm run build  # Build frontend + compile server
```

## License

MIT
