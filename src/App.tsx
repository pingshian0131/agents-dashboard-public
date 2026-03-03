import { useState } from 'react';
import type { Dashboard, MemoryPage } from './types';
import { Header } from './components/Header';
import { LanceDBPage } from './pages/LanceDBPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { StatsPage } from './pages/StatsPage';
import { SkillsPage } from './pages/SkillsPage';
import { theme } from './theme';

export default function App() {
  const [dashboard, setDashboard] = useState<Dashboard>('memory');
  const [memoryPage, setMemoryPage] = useState<MemoryPage>('lancedb');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: theme.font, background: theme.bg, color: theme.text }}>
      <Header
        dashboard={dashboard}
        onDashboardChange={setDashboard}
        memoryPage={memoryPage}
        onMemoryPageChange={setMemoryPage}
      />
      {dashboard === 'memory' && (
        <>
          {memoryPage === 'lancedb' && <LanceDBPage />}
          {memoryPage === 'workspaces' && <WorkspacePage />}
          {memoryPage === 'stats' && <StatsPage />}
        </>
      )}
      {dashboard === 'skills' && <SkillsPage />}
    </div>
  );
}
