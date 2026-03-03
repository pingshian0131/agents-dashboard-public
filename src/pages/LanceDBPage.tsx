import { useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Memory, MemoryInput, ScopeInfo } from '../types';
import { fetchMemories, fetchScopes, createMemory, updateMemory, deleteMemory } from '../api';
import { SearchBar } from '../components/SearchBar';
import { MemoryCard } from '../components/MemoryCard';
import { MemoryForm } from '../components/MemoryForm';
import { Pagination } from '../components/Pagination';
import { theme } from '../theme';

const LIMIT = 15;

interface LanceDBPageProps {
  onSidebarChange: (content: ReactNode) => void;
}

export function LanceDBPage({ onSidebarChange }: LanceDBPageProps) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [total, setTotal] = useState(0);
  const [scopes, setScopes] = useState<ScopeInfo[]>([]);
  const [selectedScope, setSelectedScope] = useState<string | undefined>();
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | undefined>();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [memResult, scopeResult] = await Promise.all([
        fetchMemories({ scope: selectedScope, search: search || undefined, limit: LIMIT, offset }),
        fetchScopes(),
      ]);
      setMemories(memResult.memories);
      setTotal(memResult.total);
      setScopes(scopeResult);
    } catch (e) {
      console.error('Failed to load:', e);
    } finally {
      setLoading(false);
    }
  }, [selectedScope, search, offset]);

  useEffect(() => { load(); }, [load]);

  // Push sidebar content up to App
  useEffect(() => {
    const sidebar = (
      <div>
        <div style={{ padding: '0 16px 8px', color: theme.green, fontSize: 12, fontWeight: 700 }}>
          SCOPES
        </div>
        <div
          onClick={() => { setSelectedScope(undefined); setOffset(0); }}
          style={{
            padding: '6px 16px',
            cursor: 'pointer',
            fontSize: 13,
            background: !selectedScope ? theme.bgHover : 'transparent',
            color: !selectedScope ? theme.green : theme.textDim,
            borderLeft: !selectedScope ? `2px solid ${theme.green}` : '2px solid transparent',
          }}
        >
          all <span style={{ color: theme.textDim, fontSize: 11 }}>({scopes.reduce((s, x) => s + x.count, 0)})</span>
        </div>
        {scopes.map(s => (
          <div
            key={s.scope}
            onClick={() => { setSelectedScope(s.scope); setOffset(0); }}
            style={{
              padding: '6px 16px',
              cursor: 'pointer',
              fontSize: 13,
              background: selectedScope === s.scope ? theme.bgHover : 'transparent',
              color: selectedScope === s.scope ? theme.green : theme.textDim,
              borderLeft: selectedScope === s.scope ? `2px solid ${theme.green}` : '2px solid transparent',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {s.scope} <span style={{ color: theme.textDim, fontSize: 11 }}>({s.count})</span>
          </div>
        ))}
      </div>
    );
    onSidebarChange(sidebar);
    return () => onSidebarChange(null);
  }, [scopes, selectedScope, onSidebarChange]);

  const handleSearch = (q: string) => {
    setSearch(q);
    setOffset(0);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this memory?')) return;
    await deleteMemory(id);
    load();
  };

  const handleEdit = (m: Memory) => {
    setEditingMemory(m);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingMemory(undefined);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: MemoryInput) => {
    if (editingMemory) {
      await updateMemory(editingMemory.id, data);
    } else {
      await createMemory(data);
    }
    setShowForm(false);
    setEditingMemory(undefined);
    load();
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ color: theme.textDim, fontSize: 12 }}>
          {loading ? 'loading...' : `${total} memories`}
          {selectedScope && <> in <span style={{ color: theme.cyan }}>{selectedScope}</span></>}
          {search && <> matching "<span style={{ color: theme.yellow }}>{search}</span>"</>}
        </span>
        <button onClick={handleCreate} style={{ ...buttonStyle, background: theme.greenDim, color: '#fff' }}>
          + new
        </button>
      </div>

      {memories.map(m => (
        <MemoryCard key={m.id} memory={m} onDelete={handleDelete} onEdit={handleEdit} />
      ))}

      {memories.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: 40, color: theme.textDim }}>
          no memories found
        </div>
      )}

      <Pagination offset={offset} limit={LIMIT} total={total} onChange={setOffset} />

      {showForm && (
        <MemoryForm
          memory={editingMemory}
          scopes={scopes.map(s => s.scope)}
          onSubmit={handleFormSubmit}
          onCancel={() => { setShowForm(false); setEditingMemory(undefined); }}
        />
      )}
    </>
  );
}

const buttonStyle: React.CSSProperties = {
  background: 'transparent',
  border: `1px solid ${theme.border}`,
  borderRadius: 4,
  color: theme.textDim,
  fontFamily: theme.font,
  fontSize: 13,
  padding: '4px 14px',
  cursor: 'pointer',
};
