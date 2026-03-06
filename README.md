# Agents Dashboard

Dashboard for [OpenClaw](https://github.com/open-claw/openclaw) agents — browse vector memories, manage workspace files, view agents, cron jobs, and skills.

**[Live Demo](https://demo-agents-dashboard.ping-claw.cc/)**

## Quick Start

### Try it instantly (no setup needed)

```bash
npx @pingshian/agents-terminal-dashboard --demo
```

Then open http://localhost:3001 in your browser.

### Connect to your OpenClaw data

```bash
npx @pingshian/agents-terminal-dashboard
```

By default it reads from `~/.openclaw-personal`. No API key needed for browsing — just point it at your LanceDB data and go.

### Browse any LanceDB database

```bash
npx @pingshian/agents-terminal-dashboard --openclaw-dir /path/to/your/data
```

### Enable memory write & vector search (optional)

To create/edit memories or use vector similarity search, provide an OpenAI API key:

```bash
OPENAI_API_KEY=sk-xxx npx @pingshian/agents-terminal-dashboard
```

## CLI Options

| Flag | Default | Description |
|------|---------|-------------|
| `--port <number>` | `3001` | Server port |
| `--openclaw-dir <path>` | `~/.openclaw-personal` | OpenClaw data directory |
| `--demo` | off | Run with built-in sample data (no dependencies needed) |
| `-h, --help` | | Show help |

## Docker

```bash
docker run -p 3001:3001 -v ~/.openclaw-personal:/data/openclaw ghcr.io/pingshian0131/agents-dashboard-public
```

With sample data:

```bash
docker run -p 3001:3001 -e DEMO_MODE=true ghcr.io/pingshian0131/agents-dashboard-public
```

## Development

```bash
git clone https://github.com/pingshian0131/agents-dashboard-public.git
cd agents-dashboard-public
npm install
npm run dev          # Frontend dev server (port 5173, proxies /api → 3001)
# In another terminal:
DEMO_MODE=true npm run server   # Backend (port 3001)
```

Build for production:

```bash
npm run build        # Builds frontend + compiles server
npm run server       # Start production server
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `DEMO_MODE` | `false` | Use built-in sample data (no OpenClaw / OpenAI needed) |
| `OPENCLAW_DIR` | `/data/openclaw` | OpenClaw data directory |
| `WORKSPACE_DIR` | same as `OPENCLAW_DIR` | Workspace root |
| `MEMORY_DB_PATH` | `OPENCLAW_DIR/memory/lancedb-pro` | LanceDB database path |
| `OPENAI_API_KEY` | — | Optional: enables memory write & vector search (not needed for browsing or demo mode) |
| `SKILLS_DIR` | `~/.claude/skills` | Global skills directory |

## Requirements

- Node.js 20+
- `OPENAI_API_KEY` — only needed for memory write and vector similarity search (browsing works without it)

## License

MIT
