/** In-memory store for DEMO_MODE — same interface as lancedb.ts */

import { randomUUID } from 'node:crypto';
import { DEMO_MEMORIES, DEMO_WORKSPACES, DEMO_SKILLS, type DemoMemory } from './demo-data.js';

// Mutable copy of demo data
let memories: DemoMemory[] = [...DEMO_MEMORIES];

export interface MemoryRecord {
  id: string;
  text: string;
  category: string;
  scope: string;
  importance: number;
  timestamp: number;
  metadata: string;
}

export interface MemoryInput {
  text: string;
  category: string;
  scope: string;
  importance: number;
  metadata?: string;
}

export async function listMemories(opts: {
  scope?: string;
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ memories: MemoryRecord[]; total: number }> {
  const limit = opts.limit ?? 20;
  const offset = opts.offset ?? 0;

  let filtered = [...memories];

  if (opts.scope) filtered = filtered.filter(m => m.scope === opts.scope);
  if (opts.category) filtered = filtered.filter(m => m.category === opts.category);

  if (opts.search && opts.search.trim()) {
    const q = opts.search.toLowerCase();
    filtered = filtered.filter(m => m.text.toLowerCase().includes(q));
  }

  // Sort by timestamp descending
  filtered.sort((a, b) => b.timestamp - a.timestamp);

  const total = filtered.length;
  const sliced = filtered.slice(offset, offset + limit);

  return { memories: sliced, total };
}

export async function getMemory(id: string): Promise<MemoryRecord | null> {
  return memories.find(m => m.id === id) ?? null;
}

export async function createMemory(input: MemoryInput): Promise<MemoryRecord> {
  const record: DemoMemory = {
    id: randomUUID(),
    text: input.text,
    category: input.category,
    scope: input.scope,
    importance: input.importance,
    timestamp: Date.now(),
    metadata: input.metadata ?? '{}',
  };
  memories.unshift(record);
  return record;
}

export async function updateMemory(id: string, input: Partial<MemoryInput>): Promise<MemoryRecord | null> {
  const idx = memories.findIndex(m => m.id === id);
  if (idx === -1) return null;

  const existing = memories[idx];
  memories[idx] = {
    ...existing,
    ...(input.text !== undefined && { text: input.text }),
    ...(input.category !== undefined && { category: input.category }),
    ...(input.scope !== undefined && { scope: input.scope }),
    ...(input.importance !== undefined && { importance: input.importance }),
    ...(input.metadata !== undefined && { metadata: input.metadata }),
  };
  return memories[idx];
}

export async function deleteMemory(id: string): Promise<boolean> {
  const len = memories.length;
  memories = memories.filter(m => m.id !== id);
  return memories.length < len;
}

export async function getScopes(): Promise<{ scope: string; count: number }[]> {
  const counts = new Map<string, number>();
  for (const m of memories) {
    counts.set(m.scope, (counts.get(m.scope) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([scope, count]) => ({ scope, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getStats(): Promise<{
  total: number;
  byScope: { scope: string; count: number }[];
  byCategory: { category: string; count: number }[];
}> {
  const scopeCounts = new Map<string, number>();
  const catCounts = new Map<string, number>();
  for (const m of memories) {
    scopeCounts.set(m.scope, (scopeCounts.get(m.scope) ?? 0) + 1);
    catCounts.set(m.category, (catCounts.get(m.category) ?? 0) + 1);
  }
  return {
    total: memories.length,
    byScope: Array.from(scopeCounts.entries()).map(([scope, count]) => ({ scope, count })).sort((a, b) => b.count - a.count),
    byCategory: Array.from(catCounts.entries()).map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count),
  };
}

// === Workspace helpers for demo mode ===

// Mutable workspace file storage (initialized from DEMO_WORKSPACES)
const wsFiles = new Map<string, Map<string, string>>();
const wsMemFiles = new Map<string, Map<string, string>>();

for (const ws of DEMO_WORKSPACES) {
  wsFiles.set(ws.name, new Map(Object.entries(ws.files)));
  wsMemFiles.set(ws.name, new Map(Object.entries(ws.memoryFiles)));
}

export function getDemoWorkspaceNames(): string[] {
  return DEMO_WORKSPACES.map(w => w.name).sort();
}

export function getDemoWorkspaceInfo(name: string) {
  const files = wsFiles.get(name);
  const memFiles = wsMemFiles.get(name);
  if (!files) return null;

  const now = new Date().toISOString();
  return {
    name,
    files: Array.from(files.entries()).map(([n, content]) => ({
      name: n,
      size: Buffer.byteLength(content, 'utf-8'),
      modified: now,
    })),
    memoryFiles: memFiles
      ? Array.from(memFiles.entries()).map(([n, content]) => ({
          name: n,
          size: Buffer.byteLength(content, 'utf-8'),
          modified: now,
        }))
      : [],
  };
}

export function getDemoWorkspaceFile(wsName: string, fileName: string): string | null {
  return wsFiles.get(wsName)?.get(fileName) ?? null;
}

export function saveDemoWorkspaceFile(wsName: string, fileName: string, content: string): boolean {
  const files = wsFiles.get(wsName);
  if (!files) return false;
  files.set(fileName, content);
  return true;
}

export function getDemoWorkspaceMemoryFile(wsName: string, fileName: string): string | null {
  return wsMemFiles.get(wsName)?.get(fileName) ?? null;
}

// === Skills helpers for demo mode ===

export function getDemoSkills() {
  const totalSkills = DEMO_SKILLS.reduce((sum, o) => sum + o.skills.length, 0);
  return { owners: DEMO_SKILLS, totalSkills };
}
