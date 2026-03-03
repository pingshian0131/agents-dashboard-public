import type { Memory, MemoryInput, ScopeInfo, Stats, Workspace, SkillsResponse } from './types';

const BASE = '/api';

async function request<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// LanceDB Memory API
export function fetchMemories(params: {
  scope?: string;
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ memories: Memory[]; total: number }> {
  const sp = new URLSearchParams();
  if (params.scope) sp.set('scope', params.scope);
  if (params.category) sp.set('category', params.category);
  if (params.search) sp.set('search', params.search);
  if (params.limit) sp.set('limit', String(params.limit));
  if (params.offset) sp.set('offset', String(params.offset));
  return request(`/memories?${sp}`);
}

export function fetchMemory(id: string): Promise<Memory> {
  return request(`/memories/${encodeURIComponent(id)}`);
}

export function createMemory(input: MemoryInput): Promise<Memory> {
  return request('/memories', { method: 'POST', body: JSON.stringify(input) });
}

export function updateMemory(id: string, input: Partial<MemoryInput>): Promise<Memory> {
  return request(`/memories/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(input) });
}

export function deleteMemory(id: string): Promise<{ ok: boolean }> {
  return request(`/memories/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export function fetchScopes(): Promise<ScopeInfo[]> {
  return request('/scopes');
}

export function fetchStats(): Promise<Stats> {
  return request('/stats');
}

// Workspace API
export function fetchWorkspaces(): Promise<Workspace[]> {
  return request('/workspaces');
}

export function fetchWorkspaceFile(workspace: string, file: string): Promise<{ name: string; content: string }> {
  return request(`/workspaces/${workspace}/${encodeURIComponent(file)}`);
}

export function saveWorkspaceFile(workspace: string, file: string, content: string): Promise<{ ok: boolean }> {
  return request(`/workspaces/${workspace}/${encodeURIComponent(file)}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  });
}

export function fetchWorkspaceMemoryFile(workspace: string, file: string): Promise<{ name: string; content: string }> {
  return request(`/workspaces/${workspace}/memory/${encodeURIComponent(file)}`);
}

// Skills API
export function fetchSkills(): Promise<SkillsResponse> {
  return request('/skills');
}
