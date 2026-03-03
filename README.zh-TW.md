**繁體中文** | [English](./README.md)

# Memory Dashboard

LanceDB 向量記憶管理儀表板 — 瀏覽、搜尋、編輯向量記憶，以及管理 workspace 檔案。

## 功能

- **記憶瀏覽** — 以 scope / category 篩選，支援全文搜尋
- **記憶管理** — 新增、編輯、刪除記憶（自動產生 embedding）
- **Workspace 管理** — 檢視和編輯 workspace 標準檔案（MEMORY.md, IDENTITY.md 等）
- **統計儀表板** — 各 scope / category 的記憶數量統計
- **Demo Mode** — 內建假資料，無需外部依賴即可體驗完整功能

## 快速開始（Demo Mode）

不需要 LanceDB 或 OpenAI API key，直接體驗完整 UI：

```bash
npm install
npm run build
DEMO_MODE=true npm run server
# → http://localhost:3001
```

### Docker（Demo Mode）

```bash
docker build -t memory-dashboard .
docker run -p 3001:3001 -e DEMO_MODE=true memory-dashboard
```

## 正式使用

連接真實 LanceDB 資料庫：

```bash
npm install
npm run build
OPENAI_API_KEY=your-key-here \
  MEMORY_DB_PATH=/path/to/lancedb \
  WORKSPACE_DIR=/path/to/workspaces \
  npm run server
```

### Docker（正式）

```bash
docker build -t memory-dashboard .
docker run -p 3001:3001 \
  -v /path/to/workspaces:/data/workspaces \
  -v /path/to/memory-db:/data/memory-db \
  -e OPENAI_API_KEY=your-key-here \
  memory-dashboard
```

## 環境變數

| 變數 | 預設值 | 說明 |
|---|---|---|
| `DEMO_MODE` | `false` | 啟用 demo 模式（in-memory 假資料） |
| `PORT` | `3001` | 伺服器監聽 port |
| `DIST_DIR` | `../dist` | 前端靜態檔案目錄 |
| `WORKSPACE_DIR` | `/data/workspaces` | Workspace 根目錄 |
| `MEMORY_DB_PATH` | `/data/memory-db` | LanceDB 資料庫路徑 |
| `MEMORY_TABLE_NAME` | `memories` | LanceDB table 名稱 |
| `EMBEDDING_MODEL` | `text-embedding-3-small` | OpenAI embedding model |
| `OPENAI_API_KEY` | — | OpenAI API key（非 demo 模式必填） |

## 技術架構

- **前端**: React 19 + Vite 6 + TypeScript
- **後端**: Node.js 原生 HTTP server（無框架）
- **資料庫**: LanceDB（向量搜尋）
- **Embeddings**: OpenAI `text-embedding-3-small`

## 開發

```bash
npm run dev    # 前端 dev server（proxy /api → localhost:3001）
npm run build  # 建置前端 + 編譯 server
```

## License

MIT
