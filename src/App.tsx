import { useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AppPage, SkillOwner, SkillSelection } from './types';
import { fetchSkills } from './api';
import { Header } from './components/Header';
import { Layout } from './components/Layout';
import { LanceDBPage } from './pages/LanceDBPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { StatsPage } from './pages/StatsPage';
import { SkillsContent, sectionLabel } from './pages/SkillsPage';
import { css, theme } from './theme';

const memoryNavItems: { id: AppPage; label: string }[] = [
  { id: 'lancedb', label: 'LanceDB' },
  { id: 'workspaces', label: 'Workspaces' },
  { id: 'stats', label: 'Stats' },
];

export default function App() {
  const [page, setPage] = useState<AppPage>('lancedb');
  const [pageSidebar, setPageSidebar] = useState<ReactNode>(null);

  // Sidebar collapse — 展開一個自動收合另一個
  const [memoryExpanded, setMemoryExpanded] = useState(true);
  const [skillsExpanded, setSkillsExpanded] = useState(false);

  // Skills data (loaded at App level for sidebar)
  const [skillOwners, setSkillOwners] = useState<SkillOwner[]>([]);
  const [totalSkills, setTotalSkills] = useState(0);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [skillsError, setSkillsError] = useState('');
  const [skillSelection, setSkillSelection] = useState<SkillSelection>({ type: 'overview' });

  useEffect(() => {
    fetchSkills()
      .then(data => {
        setSkillOwners(data.owners);
        setTotalSkills(data.totalSkills);
        setSkillsLoading(false);
      })
      .catch(e => {
        setSkillsError(e.message);
        setSkillsLoading(false);
      });
  }, []);

  const handlePageSidebarChange = useCallback((content: ReactNode) => {
    setPageSidebar(content);
  }, []);

  // Group owners into sections
  const globalOwners = skillOwners.filter(o => o.name === 'global');
  const sharedOwners = skillOwners.filter(o => o.name === 'shared');
  const agentOwners = skillOwners.filter(o => o.name !== 'global' && o.name !== 'shared');

  const renderSkillOwnerSection = (sectionName: string, sectionOwners: SkillOwner[]) => {
    if (sectionOwners.length === 0) return null;
    return (
      <div key={sectionName}>
        <div style={{ padding: '8px 16px 4px', color: theme.green, fontSize: 11, fontWeight: 700 }}>
          {sectionName}
        </div>
        {sectionOwners.map(owner => (
          <div key={owner.name}>
            <div
              onClick={() => { setPage('skills'); setSkillSelection({ type: 'owner', name: owner.name }); }}
              style={{
                padding: '5px 16px',
                cursor: 'pointer',
                fontSize: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: (page === 'skills' && skillSelection.type === 'owner' && skillSelection.name === owner.name) ||
                       (page === 'skills' && skillSelection.type === 'skill' && skillSelection.ownerName === owner.name)
                  ? theme.green : theme.text,
                fontWeight: (page === 'skills' && skillSelection.type === 'owner' && skillSelection.name === owner.name) ? 700 : 400,
                background: (page === 'skills' && skillSelection.type === 'owner' && skillSelection.name === owner.name) ? theme.bgHover : 'transparent',
              }}
            >
              <span>{sectionLabel(owner)}</span>
              <span style={{
                background: theme.bgCard,
                border: `1px solid ${theme.border}`,
                borderRadius: 8,
                padding: '0 6px',
                fontSize: 10,
                color: theme.textDim,
              }}>
                {owner.skills.length}
              </span>
            </div>
            {owner.skills.map(skill => (
              <div
                key={skill.name}
                onClick={() => { setPage('skills'); setSkillSelection({ type: 'skill', ownerName: owner.name, skillName: skill.name }); }}
                style={{
                  padding: '3px 16px 3px 32px',
                  cursor: 'pointer',
                  fontSize: 11,
                  color: (page === 'skills' && skillSelection.type === 'skill' && skillSelection.ownerName === owner.name && skillSelection.skillName === skill.name)
                    ? theme.cyan : theme.textDim,
                  background: (page === 'skills' && skillSelection.type === 'skill' && skillSelection.ownerName === owner.name && skillSelection.skillName === skill.name)
                    ? theme.bgHover : 'transparent',
                }}
              >
                {skill.name}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const unifiedSidebar = (
    <div>
      {/* MEMORY section */}
      <div
        onClick={() => {
          const next = !memoryExpanded;
          setMemoryExpanded(next);
          if (next) {
            setSkillsExpanded(false);
            if (page === 'skills') setPage('lancedb');
          }
        }}
        style={{
          padding: '0 16px 8px',
          color: page !== 'skills' ? theme.green : theme.textDim,
          fontSize: 12,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          userSelect: 'none',
        }}
      >
        <span style={{ fontSize: 10 }}>{memoryExpanded ? 'v' : '>'}</span> MEMORY
      </div>
      {memoryExpanded && (
        <>
          {memoryNavItems.map(item => (
            <div
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                padding: '6px 16px',
                cursor: 'pointer',
                fontSize: 13,
                color: page === item.id ? theme.green : theme.textDim,
                background: page === item.id ? theme.bgHover : 'transparent',
                borderLeft: page === item.id ? `2px solid ${theme.green}` : '2px solid transparent',
              }}
            >
              {item.label}
            </div>
          ))}

          {/* Page-specific sidebar (SCOPES, WORKSPACES, etc.) */}
          {pageSidebar && (
            <div style={{ borderTop: `1px solid ${theme.border}`, marginTop: 8, paddingTop: 8 }}>
              {pageSidebar}
            </div>
          )}
        </>
      )}

      {/* SKILLS section */}
      <div style={{ borderTop: `1px solid ${theme.border}`, marginTop: 8, paddingTop: 8 }}>
        <div
          onClick={() => {
            const next = !skillsExpanded;
            setSkillsExpanded(next);
            if (next) {
              setMemoryExpanded(false);
              setPage('skills');
              setSkillSelection({ type: 'overview' });
            }
          }}
          style={{
            padding: '0 16px 8px',
            color: page === 'skills' ? theme.green : theme.textDim,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            userSelect: 'none',
          }}
        >
          <span style={{ fontSize: 10 }}>{skillsExpanded ? 'v' : '>'}</span> SKILLS {!skillsLoading && !skillsError && <span style={{ fontWeight: 400, fontSize: 11 }}>({totalSkills})</span>}
        </div>
        {skillsExpanded && (
          <>
            {skillsLoading ? (
              <div style={{ padding: '4px 16px', ...css.dimText }}>loading...</div>
            ) : skillsError ? (
              <div style={{ padding: '4px 16px', color: theme.red, fontSize: 12 }}>{skillsError}</div>
            ) : (
              <>
                {renderSkillOwnerSection('GLOBAL', globalOwners)}
                {renderSkillOwnerSection('SHARED', sharedOwners)}
                {agentOwners.length > 0 && renderSkillOwnerSection('AGENTS', agentOwners)}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: theme.font, background: theme.bg, color: theme.text }}>
      <Header />
      <Layout sidebar={unifiedSidebar}>
        {page === 'lancedb' && <LanceDBPage onSidebarChange={handlePageSidebarChange} />}
        {page === 'workspaces' && <WorkspacePage onSidebarChange={handlePageSidebarChange} />}
        {page === 'stats' && <StatsPage onSidebarChange={handlePageSidebarChange} />}
        {page === 'skills' && (
          <SkillsContent
            owners={skillOwners}
            totalSkills={totalSkills}
            selection={skillSelection}
            loading={skillsLoading}
            error={skillsError}
          />
        )}
      </Layout>
    </div>
  );
}
