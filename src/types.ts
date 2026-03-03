export interface Memory {
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

export interface ScopeInfo {
  scope: string;
  count: number;
}

export interface Stats {
  total: number;
  byScope: ScopeInfo[];
  byCategory: { category: string; count: number }[];
}

export interface WorkspaceFile {
  name: string;
  size: number;
  modified: string;
}

export interface Workspace {
  name: string;
  files: WorkspaceFile[];
  memoryFiles: WorkspaceFile[];
}

export type Page = 'lancedb' | 'workspaces' | 'stats';

// 頂層 Dashboard 切換
export type Dashboard = 'memory' | 'skills';

// Memory Dashboard 的 sub-page
export type MemoryPage = 'lancedb' | 'workspaces' | 'stats';

// Skills 型別
export interface Skill {
  name: string;
  description: string;
  homepage?: string;
  version?: string;
  files: { name: string; size: number }[];
  totalSize: number;
}

export interface SkillOwner {
  name: string;
  label: string;
  skills: Skill[];
}

export interface SkillsResponse {
  owners: SkillOwner[];
  totalSkills: number;
}
