import { theme } from '../theme';

export function Header() {
  return (
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
        {'>'} OpenClaw Dashboard
      </span>
      <span style={{ color: theme.textDim, fontSize: 12 }}>v0.1.0</span>
    </header>
  );
}
