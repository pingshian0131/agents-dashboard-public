**繁體中文** | [English](./README.md)

# Agents Dashboard

[OpenClaw](https://github.com/open-claw/openclaw) agent 管理儀表板 — 記憶、agents、排程任務、skills。

**[線上 Demo](https://demo-agents-dashboard.ping-claw.cc/)**

## 安裝

```
npx @pingshian/agents-terminal-dashboard
```

需要 Node.js 20+。自動偵測 `~/.openclaw-personal`。

## 選項

| 參數 | 預設值 | 說明 |
|------|--------|------|
| `--port` | `3001` | 伺服器 port |
| `--openclaw-dir` | `~/.openclaw-personal` | OpenClaw 資料目錄 |
| `--demo` | | 使用內建範例資料（不需要 OpenClaw） |

## Docker

```
docker run -p 3001:3001 -v ~/.openclaw-personal:/data/openclaw ghcr.io/pingshian0131/agents-dashboard-public
```

## 環境變數

| 變數 | 預設值 | 說明 |
|------|--------|------|
| `PORT` | `3001` | 伺服器 port |
| `OPENCLAW_DIR` | `/data/openclaw` | OpenClaw 資料目錄 |
| `WORKSPACE_DIR` | `= OPENCLAW_DIR` | Workspace 根目錄 |
| `MEMORY_DB_PATH` | `= OPENCLAW_DIR/memory/lancedb-pro` | LanceDB 路徑 |
| `OPENAI_API_KEY` | — | 記憶搜尋/寫入需要 |
| `DEMO_MODE` | `false` | 使用內建範例資料 |

## License

MIT
