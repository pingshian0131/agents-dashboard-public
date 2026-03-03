import { useState, useEffect, type ReactNode } from 'react';
import type { Workspace } from '../types';
import { fetchWorkspaces, fetchWorkspaceFile, saveWorkspaceFile, fetchWorkspaceMemoryFile } from '../api';
import { css, theme } from '../theme';

interface WorkspacePageProps {
  onSidebarChange: (content: ReactNode) => void;
}

export function WorkspacePage({ onSidebarChange }: WorkspacePageProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWs, setSelectedWs] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [isMemoryFile, setIsMemoryFile] = useState(false);
  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedMemDirs, setExpandedMemDirs] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchWorkspaces().then(ws => {
      setWorkspaces(ws);
      setLoading(false);
    });
  }, []);

  const loadFile = async (ws: string, file: string, fromMemDir: boolean) => {
    setSelectedWs(ws);
    setSelectedFile(file);
    setIsMemoryFile(fromMemDir);
    try {
      const result = fromMemDir
        ? await fetchWorkspaceMemoryFile(ws, file)
        : await fetchWorkspaceFile(ws, file);
      setContent(result.content);
      setOriginalContent(result.content);
    } catch {
      setContent('// failed to load file');
      setOriginalContent('');
    }
  };

  const handleSave = async () => {
    if (!selectedWs || !selectedFile || isMemoryFile) return;
    setSaving(true);
    try {
      await saveWorkspaceFile(selectedWs, selectedFile, content);
      setOriginalContent(content);
    } catch (e: any) {
      alert('Save failed: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const isDirty = content !== originalContent;

  const toggleMemDir = (name: string) => {
    setExpandedMemDirs(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const shortName = (name: string) => name.replace('workspace-', '').replace('workspace', 'default');

  // Push sidebar content up to App
  useEffect(() => {
    const sidebar = (
      <div>
        <div style={{ padding: '0 16px 8px', color: theme.green, fontSize: 12, fontWeight: 700 }}>
          WORKSPACES
        </div>
        {loading ? (
          <div style={{ padding: '8px 16px', ...css.dimText }}>loading...</div>
        ) : (
          workspaces.map(ws => (
            <div key={ws.name}>
              <div style={{
                padding: '6px 16px',
                fontSize: 13,
                color: selectedWs === ws.name ? theme.green : theme.text,
                fontWeight: selectedWs === ws.name ? 700 : 400,
              }}>
                {shortName(ws.name)}
              </div>
              {ws.files.map(f => (
                <div
                  key={f.name}
                  onClick={() => loadFile(ws.name, f.name, false)}
                  style={{
                    padding: '3px 16px 3px 32px',
                    cursor: 'pointer',
                    fontSize: 12,
                    color: (selectedWs === ws.name && selectedFile === f.name && !isMemoryFile) ? theme.cyan : theme.textDim,
                    background: (selectedWs === ws.name && selectedFile === f.name && !isMemoryFile) ? theme.bgHover : 'transparent',
                  }}
                >
                  {f.name}
                </div>
              ))}
              {ws.memoryFiles.length > 0 && (
                <>
                  <div
                    onClick={() => toggleMemDir(ws.name)}
                    style={{ padding: '3px 16px 3px 32px', cursor: 'pointer', fontSize: 12, color: theme.yellow }}
                  >
                    {expandedMemDirs.has(ws.name) ? 'v' : '>'} memory/
                  </div>
                  {expandedMemDirs.has(ws.name) && ws.memoryFiles.map(f => (
                    <div
                      key={f.name}
                      onClick={() => loadFile(ws.name, f.name, true)}
                      style={{
                        padding: '3px 16px 3px 48px',
                        cursor: 'pointer',
                        fontSize: 11,
                        color: (selectedWs === ws.name && selectedFile === f.name && isMemoryFile) ? theme.cyan : theme.textDim,
                        background: (selectedWs === ws.name && selectedFile === f.name && isMemoryFile) ? theme.bgHover : 'transparent',
                      }}
                    >
                      {f.name}
                    </div>
                  ))}
                </>
              )}
            </div>
          ))
        )}
      </div>
    );
    onSidebarChange(sidebar);
    return () => onSidebarChange(null);
  }, [workspaces, selectedWs, selectedFile, isMemoryFile, loading, expandedMemDirs, onSidebarChange]);

  return (
    <>
      {selectedFile ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13 }}>
              <span style={{ color: theme.textDim }}>{shortName(selectedWs)} / </span>
              <span style={{ color: theme.cyan }}>{isMemoryFile ? `memory/${selectedFile}` : selectedFile}</span>
              {isDirty && <span style={{ color: theme.yellow, marginLeft: 8 }}>*</span>}
              {isMemoryFile && <span style={{ color: theme.textDim, fontSize: 11, marginLeft: 8 }}>(read-only)</span>}
            </span>
            {!isMemoryFile && (
              <button
                onClick={handleSave}
                disabled={!isDirty || saving}
                style={{
                  ...css.button,
                  opacity: isDirty ? 1 : 0.4,
                }}
              >
                {saving ? 'saving...' : 'save'}
              </button>
            )}
          </div>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            readOnly={isMemoryFile}
            style={{
              ...css.input,
              height: 'calc(100vh - 160px)',
              resize: 'none',
              lineHeight: 1.6,
              fontSize: 13,
              background: isMemoryFile ? '#0a0c10' : '#010409',
            }}
          />
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: 60, color: theme.textDim }}>
          {'<'}- select a workspace file to view
        </div>
      )}
    </>
  );
}
