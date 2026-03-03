import type { Dashboard, MemoryPage } from '../types';
import { theme } from '../theme';

const memoryTabs: { id: MemoryPage; label: string }[] = [
  { id: 'lancedb', label: 'LanceDB' },
  { id: 'workspaces', label: 'Workspaces' },
  { id: 'stats', label: 'Stats' },
];

const dashboards: { id: Dashboard; label: string }[] = [
  { id: 'memory', label: 'Memory' },
  { id: 'skills', label: 'Skills' },
];

interface HeaderProps {
  dashboard: Dashboard;
  onDashboardChange: (d: Dashboard) => void;
  memoryPage: MemoryPage;
  onMemoryPageChange: (p: MemoryPage) => void;
}

export function Header({ dashboard, onDashboardChange, memoryPage, onMemoryPageChange }: HeaderProps) {
  return (
    <div>
      {/* 頂層列：title + dashboard switcher */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        height: 48,
        background: theme.bgCard,
        borderBottom: `1px solid ${theme.border}`,
      }}>
        <span style={{ color: theme.green, fontWeight: 700, fontSize: 15 }}>
          {'>'} Memory Dashboard
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <nav style={{ display: 'flex', gap: 4 }}>
            {dashboards.map(d => (
              <button
                key={d.id}
                onClick={() => onDashboardChange(d.id)}
                style={{
                  background: dashboard === d.id ? theme.greenDim : 'transparent',
                  border: `1px solid ${dashboard === d.id ? theme.greenDim : theme.border}`,
                  borderRadius: 4,
                  color: dashboard === d.id ? '#fff' : theme.textDim,
                  fontFamily: theme.font,
                  fontSize: 13,
                  padding: '4px 14px',
                  cursor: 'pointer',
                }}
              >
                [{d.label}]
              </button>
            ))}
          </nav>
          <span style={{ color: theme.textDim, fontSize: 12, marginLeft: 8 }}>v0.1.0</span>
        </div>
      </header>

      {/* Memory sub-tabs（只在 Memory dashboard 時顯示） */}
      {dashboard === 'memory' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          height: 36,
          background: theme.bg,
          borderBottom: `1px solid ${theme.border}`,
          gap: 4,
        }}>
          {memoryTabs.map(t => (
            <button
              key={t.id}
              onClick={() => onMemoryPageChange(t.id)}
              style={{
                background: memoryPage === t.id ? theme.bgCard : 'transparent',
                border: `1px solid ${memoryPage === t.id ? theme.border : 'transparent'}`,
                borderRadius: 4,
                color: memoryPage === t.id ? theme.text : theme.textDim,
                fontFamily: theme.font,
                fontSize: 12,
                padding: '3px 12px',
                cursor: 'pointer',
              }}
            >
              [{t.label}]
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
