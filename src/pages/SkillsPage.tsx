import { useState, useEffect } from 'react';
import type { SkillOwner, Skill } from '../types';
import { fetchSkills } from '../api';
import { Layout } from '../components/Layout';
import { css, theme } from '../theme';

type Selection = { type: 'overview' } | { type: 'owner'; name: string } | { type: 'skill'; ownerName: string; skillName: string };

const SECTION_LABELS: Record<string, string> = {
  global: 'GLOBAL',
  shared: 'SHARED',
};

function sectionLabel(owner: SkillOwner): string {
  return SECTION_LABELS[owner.name] || owner.label.toUpperCase();
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function SkillCard({ skill }: { skill: Skill }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ ...css.card, marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ color: theme.cyan, fontSize: 14, fontWeight: 700 }}>{skill.name}</span>
          {skill.version && <span style={{ color: theme.textDim, fontSize: 11, marginLeft: 8 }}>v{skill.version}</span>}
        </div>
        <span style={{ ...css.dimText }}>{formatSize(skill.totalSize)}</span>
      </div>
      {skill.description && (
        <div style={{ color: theme.text, fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>{skill.description}</div>
      )}
      {skill.homepage && (
        <div style={{ marginTop: 4 }}>
          <a href={skill.homepage} target="_blank" rel="noopener noreferrer" style={{ color: theme.green, fontSize: 11 }}>
            {skill.homepage}
          </a>
        </div>
      )}
      <div style={{ marginTop: 8 }}>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'transparent',
            border: 'none',
            color: theme.textDim,
            fontFamily: theme.font,
            fontSize: 11,
            cursor: 'pointer',
            padding: 0,
          }}
        >
          {expanded ? 'v' : '>'} {skill.files.length} files
        </button>
        {expanded && (
          <div style={{ marginTop: 4 }}>
            {skill.files.map(f => (
              <div key={f.name} style={{ fontSize: 11, color: theme.textDim, padding: '1px 0 1px 12px' }}>
                {f.name} <span style={{ color: theme.yellow }}>{formatSize(f.size)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function SkillsPage() {
  const [owners, setOwners] = useState<SkillOwner[]>([]);
  const [totalSkills, setTotalSkills] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selection, setSelection] = useState<Selection>({ type: 'overview' });

  useEffect(() => {
    fetchSkills()
      .then(data => {
        setOwners(data.owners);
        setTotalSkills(data.totalSkills);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const selectedOwner = selection.type === 'owner'
    ? owners.find(o => o.name === selection.name)
    : selection.type === 'skill'
      ? owners.find(o => o.name === selection.ownerName)
      : null;

  const selectedSkill = selection.type === 'skill'
    ? selectedOwner?.skills.find(s => s.name === selection.skillName)
    : null;

  // Group owners into sections
  const globalOwners = owners.filter(o => o.name === 'global');
  const sharedOwners = owners.filter(o => o.name === 'shared');
  const agentOwners = owners.filter(o => o.name !== 'global' && o.name !== 'shared');

  const renderOwnerSection = (sectionName: string, sectionOwners: SkillOwner[]) => {
    if (sectionOwners.length === 0) return null;
    return (
      <div key={sectionName}>
        <div style={{ padding: '8px 16px 4px', color: theme.green, fontSize: 11, fontWeight: 700 }}>
          {sectionName}
        </div>
        {sectionOwners.map(owner => (
          <div key={owner.name}>
            <div
              onClick={() => setSelection({ type: 'owner', name: owner.name })}
              style={{
                padding: '5px 16px',
                cursor: 'pointer',
                fontSize: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: (selection.type === 'owner' && selection.name === owner.name) ||
                       (selection.type === 'skill' && selection.ownerName === owner.name)
                  ? theme.green : theme.text,
                fontWeight: (selection.type === 'owner' && selection.name === owner.name) ? 700 : 400,
                background: (selection.type === 'owner' && selection.name === owner.name) ? theme.bgHover : 'transparent',
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
                onClick={() => setSelection({ type: 'skill', ownerName: owner.name, skillName: skill.name })}
                style={{
                  padding: '3px 16px 3px 32px',
                  cursor: 'pointer',
                  fontSize: 11,
                  color: (selection.type === 'skill' && selection.ownerName === owner.name && selection.skillName === skill.name)
                    ? theme.cyan : theme.textDim,
                  background: (selection.type === 'skill' && selection.ownerName === owner.name && selection.skillName === skill.name)
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

  const sidebar = (
    <div>
      <div
        onClick={() => setSelection({ type: 'overview' })}
        style={{
          padding: '6px 16px 10px',
          color: selection.type === 'overview' ? theme.green : theme.textDim,
          fontSize: 12,
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        SKILLS OVERVIEW
      </div>
      {loading ? (
        <div style={{ padding: '8px 16px', ...css.dimText }}>loading...</div>
      ) : error ? (
        <div style={{ padding: '8px 16px', color: theme.red, fontSize: 12 }}>{error}</div>
      ) : (
        <>
          {renderOwnerSection('GLOBAL', globalOwners)}
          {renderOwnerSection('SHARED', sharedOwners)}
          {agentOwners.length > 0 && renderOwnerSection('AGENTS', agentOwners)}
        </>
      )}
    </div>
  );

  const renderOverview = () => (
    <div>
      <h2 style={{ color: theme.green, fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>
        Skills Overview
      </h2>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ ...css.card, flex: 1, textAlign: 'center' }}>
          <div style={{ ...css.score, fontSize: 24 }}>{totalSkills}</div>
          <div style={{ ...css.dimText, marginTop: 4 }}>Total Skills</div>
        </div>
        <div style={{ ...css.card, flex: 1, textAlign: 'center' }}>
          <div style={{ ...css.score, fontSize: 24 }}>{owners.length}</div>
          <div style={{ ...css.dimText, marginTop: 4 }}>Sources</div>
        </div>
      </div>
      {owners.map(owner => (
        <div key={owner.name} style={{ ...css.card, marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: theme.cyan, fontSize: 13 }}>{sectionLabel(owner)}</span>
            <span style={{ ...css.tag }}>{owner.skills.length} skills</span>
          </div>
          <div style={{ ...css.dimText, marginTop: 4 }}>
            {owner.skills.map(s => s.name).join(', ')}
          </div>
        </div>
      ))}
    </div>
  );

  const renderOwnerSkills = (owner: SkillOwner) => (
    <div>
      <h2 style={{ color: theme.green, fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>
        {sectionLabel(owner)} <span style={{ color: theme.textDim, fontWeight: 400, fontSize: 13 }}>({owner.skills.length} skills)</span>
      </h2>
      {owner.skills.map(skill => (
        <SkillCard key={skill.name} skill={skill} />
      ))}
    </div>
  );

  const renderSkillDetail = (skill: Skill) => (
    <div>
      <SkillCard skill={skill} />
    </div>
  );

  return (
    <Layout sidebar={sidebar}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: theme.textDim }}>loading skills...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: 60, color: theme.red }}>{error}</div>
      ) : selection.type === 'overview' ? (
        renderOverview()
      ) : selection.type === 'owner' && selectedOwner ? (
        renderOwnerSkills(selectedOwner)
      ) : selection.type === 'skill' && selectedSkill ? (
        renderSkillDetail(selectedSkill)
      ) : (
        <div style={{ textAlign: 'center', padding: 60, color: theme.textDim }}>
          {'<'}- select a skill source or skill
        </div>
      )}
    </Layout>
  );
}
