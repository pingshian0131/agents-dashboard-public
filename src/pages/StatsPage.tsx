import { useState, useEffect, type ReactNode } from 'react';
import type { Stats } from '../types';
import { fetchStats } from '../api';
import { css, theme } from '../theme';

function Bar({ label, count, max }: { label: string; count: number; max: number }) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      <span style={{ minWidth: 160, fontSize: 12, color: theme.textDim, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 16, background: theme.bgCard, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: theme.greenDim, borderRadius: 2, transition: 'width 0.3s' }} />
      </div>
      <span style={{ minWidth: 36, fontSize: 12, color: theme.yellow, textAlign: 'right' }}>{count}</span>
    </div>
  );
}

interface StatsPageProps {
  onSidebarChange: (content: ReactNode) => void;
}

export function StatsPage({ onSidebarChange }: StatsPageProps) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetchStats().then(setStats);
  }, []);

  useEffect(() => {
    onSidebarChange(null);
    return () => onSidebarChange(null);
  }, [onSidebarChange]);

  if (!stats) return <div style={{ padding: 40, color: theme.textDim }}>loading...</div>;

  const maxScope = Math.max(...stats.byScope.map(s => s.count), 1);
  const maxCat = Math.max(...stats.byCategory.map(c => c.count), 1);

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 20 }}>
      {/* Total */}
      <div style={{ ...css.card, marginBottom: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: theme.textDim, marginBottom: 4 }}>TOTAL MEMORIES</div>
        <div style={{ fontSize: 36, color: theme.green, fontWeight: 700 }}>{stats.total}</div>
      </div>

      {/* By Scope */}
      <div style={{ ...css.card, marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: theme.green, fontWeight: 700, marginBottom: 12 }}>BY SCOPE</div>
        {stats.byScope.map(s => (
          <Bar key={s.scope} label={s.scope} count={s.count} max={maxScope} />
        ))}
      </div>

      {/* By Category */}
      <div style={{ ...css.card }}>
        <div style={{ fontSize: 12, color: theme.green, fontWeight: 700, marginBottom: 12 }}>BY CATEGORY</div>
        {stats.byCategory.map(c => (
          <Bar key={c.category} label={`[${c.category}]`} count={c.count} max={maxCat} />
        ))}
      </div>
    </div>
  );
}
