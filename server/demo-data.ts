/** Demo data for DEMO_MODE — fake memories and workspace files */

export interface DemoMemory {
  id: string;
  text: string;
  category: string;
  scope: string;
  importance: number;
  timestamp: number;
  metadata: string;
}

const now = Date.now();
const hour = 3600_000;
const day = 24 * hour;

export const DEMO_MEMORIES: DemoMemory[] = [
  // === global ===
  { id: 'demo-001', text: 'The project uses TypeScript 5.x with strict mode enabled across all packages.', category: 'fact', scope: 'global', importance: 0.9, timestamp: now - 2 * day, metadata: '{}' },
  { id: 'demo-002', text: 'Chose PostgreSQL over MongoDB for the main database due to relational data requirements and ACID compliance needs.', category: 'decision', scope: 'global', importance: 0.85, timestamp: now - 5 * day, metadata: '{}' },
  { id: 'demo-003', text: 'User prefers dark terminal-style UI with monospace fonts (JetBrains Mono).', category: 'preference', scope: 'global', importance: 0.7, timestamp: now - 10 * day, metadata: '{}' },
  { id: 'demo-004', text: 'All API responses must follow { data, error, meta } envelope format for consistency.', category: 'decision', scope: 'global', importance: 0.8, timestamp: now - 3 * day, metadata: '{}' },
  { id: 'demo-005', text: 'The team follows trunk-based development with short-lived feature branches.', category: 'fact', scope: 'global', importance: 0.6, timestamp: now - 7 * day, metadata: '{}' },
  { id: 'demo-006', text: 'Error messages should be user-friendly in zh-TW, but log messages in English.', category: 'preference', scope: 'global', importance: 0.65, timestamp: now - 4 * day, metadata: '{}' },
  { id: 'demo-007', text: 'Deploy pipeline: GitHub Actions → Docker build → push to registry → Kubernetes rollout.', category: 'fact', scope: 'global', importance: 0.75, timestamp: now - 6 * day, metadata: '{}' },

  // === project-web-app ===
  { id: 'demo-008', text: 'Frontend uses React 19 with Vite 6 as the build tool. No CSS framework — all inline styles.', category: 'fact', scope: 'project-web-app', importance: 0.9, timestamp: now - 1 * day, metadata: '{}' },
  { id: 'demo-009', text: 'Using TanStack Query for server state management instead of Redux. Local state stays in useState/useReducer.', category: 'decision', scope: 'project-web-app', importance: 0.8, timestamp: now - 3 * day, metadata: '{}' },
  { id: 'demo-010', text: 'Route structure: / (dashboard), /memories (list), /memories/:id (detail), /workspaces (file browser), /stats (analytics).', category: 'fact', scope: 'project-web-app', importance: 0.7, timestamp: now - 2 * day, metadata: '{}' },
  { id: 'demo-011', text: 'Form validation uses Zod schemas shared between frontend and backend for type safety.', category: 'decision', scope: 'project-web-app', importance: 0.75, timestamp: now - 8 * day, metadata: '{}' },
  { id: 'demo-012', text: 'All interactive elements must have keyboard accessibility and visible focus indicators.', category: 'preference', scope: 'project-web-app', importance: 0.6, timestamp: now - 9 * day, metadata: '{}' },
  { id: 'demo-013', text: 'The search component supports both full-text search and vector similarity search with a toggle.', category: 'fact', scope: 'project-web-app', importance: 0.85, timestamp: now - 1 * day, metadata: '{}' },

  // === project-api-server ===
  { id: 'demo-014', text: 'API server runs on Node.js 22 with native HTTP module — no Express or Fastify dependency.', category: 'fact', scope: 'project-api-server', importance: 0.9, timestamp: now - 2 * day, metadata: '{}' },
  { id: 'demo-015', text: 'Main database tables: users, sessions, memories, workspaces, audit_logs.', category: 'entity', scope: 'project-api-server', importance: 0.8, timestamp: now - 4 * day, metadata: '{}' },
  { id: 'demo-016', text: 'Rate limiting: 100 requests/minute per IP for public endpoints, 1000/minute for authenticated users.', category: 'decision', scope: 'project-api-server', importance: 0.7, timestamp: now - 5 * day, metadata: '{}' },
  { id: 'demo-017', text: 'Authentication uses JWT with 15-minute access tokens and 7-day refresh tokens stored in httpOnly cookies.', category: 'decision', scope: 'project-api-server', importance: 0.85, timestamp: now - 6 * day, metadata: '{}' },
  { id: 'demo-018', text: 'LanceDB is used as the vector database for memory storage. Embedding model: text-embedding-3-small (1536 dimensions).', category: 'fact', scope: 'project-api-server', importance: 0.9, timestamp: now - 1 * day, metadata: '{}' },
  { id: 'demo-019', text: 'Batch embedding requests are capped at 100 texts per call to avoid OpenAI rate limits.', category: 'decision', scope: 'project-api-server', importance: 0.65, timestamp: now - 3 * day, metadata: '{}' },

  // === user-preferences ===
  { id: 'demo-020', text: 'Always use 2-space indentation and single quotes in TypeScript files.', category: 'preference', scope: 'user-preferences', importance: 0.8, timestamp: now - 12 * day, metadata: '{}' },
  { id: 'demo-021', text: 'Commit messages follow Conventional Commits: feat:, fix:, docs:, refactor:, test:, chore:.', category: 'preference', scope: 'user-preferences', importance: 0.75, timestamp: now - 11 * day, metadata: '{}' },
  { id: 'demo-022', text: 'Prefer named exports over default exports for better IDE autocomplete and refactoring support.', category: 'preference', scope: 'user-preferences', importance: 0.6, timestamp: now - 15 * day, metadata: '{}' },
  { id: 'demo-023', text: 'Never use any as a type annotation. Use unknown and narrow with type guards instead.', category: 'preference', scope: 'user-preferences', importance: 0.7, timestamp: now - 14 * day, metadata: '{}' },
  { id: 'demo-024', text: 'Variable and function names in English, comments in zh-TW when explaining business logic.', category: 'preference', scope: 'user-preferences', importance: 0.55, timestamp: now - 13 * day, metadata: '{}' },

  // === project-data-pipeline ===
  { id: 'demo-025', text: 'Data pipeline ingests from 3 sources: REST API polling (5min), WebSocket streams, and daily CSV uploads.', category: 'fact', scope: 'project-data-pipeline', importance: 0.85, timestamp: now - 2 * day, metadata: '{}' },
  { id: 'demo-026', text: 'ETL jobs run on a cron schedule: hourly aggregation, daily summaries, weekly reports.', category: 'fact', scope: 'project-data-pipeline', importance: 0.7, timestamp: now - 4 * day, metadata: '{}' },
  { id: 'demo-027', text: 'Chose Apache Arrow format for intermediate data storage for zero-copy interop with LanceDB.', category: 'decision', scope: 'project-data-pipeline', importance: 0.75, timestamp: now - 6 * day, metadata: '{}' },

  // === misc ===
  { id: 'demo-028', text: 'Production Kubernetes cluster runs on 3 nodes (4 vCPU, 16GB RAM each) in us-west-2 region.', category: 'entity', scope: 'global', importance: 0.6, timestamp: now - 20 * day, metadata: '{}' },
  { id: 'demo-029', text: 'Staging environment mirrors production but with smaller instance sizes. Data is refreshed weekly from anonymized production dumps.', category: 'fact', scope: 'global', importance: 0.55, timestamp: now - 18 * day, metadata: '{}' },
  { id: 'demo-030', text: 'The monitoring stack uses Prometheus + Grafana. Alerts go to a dedicated Slack channel.', category: 'fact', scope: 'global', importance: 0.65, timestamp: now - 16 * day, metadata: '{}' },
];

// === Demo workspace files ===

export interface DemoWorkspace {
  name: string;
  files: Record<string, string>;       // standard files
  memoryFiles: Record<string, string>;  // memory/ subdirectory files
}

// === Demo skills ===

export interface DemoSkill {
  name: string;
  description: string;
  homepage?: string;
  version?: string;
  files: { name: string; size: number }[];
  totalSize: number;
}

export interface DemoSkillOwner {
  name: string;
  label: string;
  skills: DemoSkill[];
}

export const DEMO_SKILLS: DemoSkillOwner[] = [
  {
    name: 'global',
    label: 'Global',
    skills: [
      {
        name: 'code-review',
        description: 'Automated code review with best practices checking and security scanning.',
        homepage: 'https://github.com/example/code-review-skill',
        version: '1.2.0',
        files: [
          { name: 'SKILL.md', size: 2048 },
          { name: '_meta.json', size: 256 },
          { name: 'references/guidelines.md', size: 4096 },
        ],
        totalSize: 6400,
      },
      {
        name: 'git-commit',
        description: 'Generate conventional commit messages from staged changes.',
        version: '0.9.1',
        files: [
          { name: 'SKILL.md', size: 1536 },
          { name: '_meta.json', size: 198 },
        ],
        totalSize: 1734,
      },
      {
        name: 'explain-code',
        description: 'Explain code snippets with detailed annotations and complexity analysis.',
        homepage: 'https://github.com/example/explain-code',
        version: '2.0.0',
        files: [
          { name: 'SKILL.md', size: 3072 },
          { name: '_meta.json', size: 210 },
          { name: 'references/examples.md', size: 5120 },
        ],
        totalSize: 8402,
      },
    ],
  },
  {
    name: 'shared',
    label: 'Shared',
    skills: [
      {
        name: 'deploy-pipeline',
        description: 'CI/CD pipeline configuration and deployment automation.',
        version: '1.0.0',
        files: [
          { name: 'SKILL.md', size: 2560 },
          { name: '_meta.json', size: 180 },
          { name: 'references/docker-template.md', size: 1024 },
          { name: 'references/k8s-template.md', size: 2048 },
        ],
        totalSize: 5812,
      },
      {
        name: 'api-design',
        description: 'RESTful API design patterns and OpenAPI specification generation.',
        homepage: 'https://github.com/example/api-design-skill',
        version: '1.5.2',
        files: [
          { name: 'SKILL.md', size: 4096 },
          { name: '_meta.json', size: 220 },
        ],
        totalSize: 4316,
      },
    ],
  },
  {
    name: 'workspace-project-alpha',
    label: 'project-alpha',
    skills: [
      {
        name: 'data-viz',
        description: 'D3.js data visualization templates and chart generation.',
        version: '0.3.0',
        files: [
          { name: 'SKILL.md', size: 1800 },
          { name: 'references/chart-types.md', size: 3200 },
        ],
        totalSize: 5000,
      },
    ],
  },
];

export const DEMO_WORKSPACES: DemoWorkspace[] = [
  {
    name: 'workspace',
    files: {
      'MEMORY.md': `# Memory

## 記憶管理規則

- 重要的技術決策一律記錄，importance ≥ 0.7
- 用戶偏好記錄在 user-preferences scope
- 過時的記憶定期清理（每月一次）
- 記憶分類：fact, decision, preference, entity, other

## 近期重點

- 完成向量搜尋功能整合
- 資料庫從 SQLite 遷移至 LanceDB
- 前端重構為 React 19 + inline styles
`,
      'IDENTITY.md': `# Identity

You are a helpful AI development assistant specialized in full-stack TypeScript projects.

## Core Traits

- Precise and thorough in code reviews
- Prefers simple, readable code over clever abstractions
- Always considers edge cases and error handling
- Communicates in zh-TW for explanations, English for code

## Expertise

- TypeScript / Node.js / React ecosystem
- Vector databases and embedding systems
- DevOps and CI/CD pipelines
`,
      'SOUL.md': `# Soul

## Values

- Code quality over shipping speed
- Documentation is a first-class citizen
- Test coverage is non-negotiable for critical paths
- Accessibility is not an afterthought

## Communication Style

- Direct and concise
- Uses concrete examples over abstract explanations
- Asks clarifying questions when requirements are ambiguous
`,
    },
    memoryFiles: {
      'lancedb-schema.md': `# LanceDB Schema

## memories table

| Column | Type | Description |
|---|---|---|
| id | string | UUID primary key |
| text | string | Memory content |
| vector | float32[1536] | Embedding vector |
| category | string | fact / decision / preference / entity / other |
| scope | string | Namespace for grouping |
| importance | float | 0.0 - 1.0 |
| timestamp | int64 | Unix timestamp in ms |
| metadata | string | JSON metadata |
`,
    },
  },
  {
    name: 'workspace-project-alpha',
    files: {
      'MEMORY.md': `# Project Alpha — Memory

## 專案概述

Project Alpha 是一個即時資料分析平台，處理串流資料並提供視覺化儀表板。

## 技術棧

- Backend: Node.js + Fastify
- Frontend: React + D3.js
- Database: PostgreSQL + TimescaleDB
- Message Queue: Redis Streams

## 已知問題

- [ ] 大量資料時 D3 渲染效能下降
- [ ] WebSocket 斷線重連機制需要改進
`,
      'IDENTITY.md': `# Project Alpha Identity

This workspace is dedicated to Project Alpha — a real-time data analytics platform.

Focus areas:
- Stream processing optimization
- Dashboard performance
- Data pipeline reliability
`,
      'SOUL.md': `# Project Alpha Soul

## Principles

- Real-time means < 500ms end-to-end latency
- Data accuracy is paramount — never sacrifice correctness for speed
- Graceful degradation when upstream services are slow
`,
      'HEARTBEAT.md': `# Heartbeat

Last active: 2025-03-01
Status: Active development
Sprint: Sprint 14 — Dashboard v2 redesign
Next milestone: 2025-03-15 — Beta release
`,
    },
    memoryFiles: {
      'api-design.md': `# API Design Notes

## Endpoints

- GET /api/streams — List active data streams
- POST /api/streams — Create new stream
- GET /api/dashboards/:id — Get dashboard config
- WS /ws/stream/:id — Real-time data subscription
`,
    },
  },
  {
    name: 'workspace-daily',
    files: {
      'MEMORY.md': `# Daily Workspace — Memory

日常工作筆記和待辦事項。

## 今日重點

- Review PR #42: 向量搜尋最佳化
- 更新部署文件
- 修復 memory dashboard 分頁 bug

## 本週目標

- [ ] 完成 LanceDB migration script
- [ ] 撰寫 API 文件
- [x] 設定 CI/CD pipeline
`,
      'HEARTBEAT.md': `# Heartbeat

Last active: 2025-03-03
Status: Active
Current focus: Memory Dashboard development
`,
    },
    memoryFiles: {},
  },
];
