import { useState } from 'react';
import type { SkillOwner, Skill, SkillSelection } from '../types';
import { css, theme } from '../theme';

const SECTION_LABELS: Record<string, string> = {
  global: 'GLOBAL',
  shared: 'SHARED',
};

export function sectionLabel(owner: SkillOwner): string {
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

interface SkillsContentProps {
  owners: SkillOwner[];
  totalSkills: number;
  selection: SkillSelection;
  loading: boolean;
  error: string;
}

export function SkillsContent({ owners, totalSkills, selection, loading, error }: SkillsContentProps) {
  const selectedOwner = selection.type === 'owner'
    ? owners.find(o => o.name === selection.name)
    : selection.type === 'skill'
      ? owners.find(o => o.name === selection.ownerName)
      : null;

  const selectedSkill = selection.type === 'skill'
    ? selectedOwner?.skills.find(s => s.name === selection.skillName)
    : null;

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

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 60, color: theme.textDim }}>loading skills...</div>;
  }
  if (error) {
    return <div style={{ textAlign: 'center', padding: 60, color: theme.red }}>{error}</div>;
  }
  if (selection.type === 'overview') {
    return renderOverview();
  }
  if (selection.type === 'owner' && selectedOwner) {
    return renderOwnerSkills(selectedOwner);
  }
  if (selection.type === 'skill' && selectedSkill) {
    return renderSkillDetail(selectedSkill);
  }
  return (
    <div style={{ textAlign: 'center', padding: 60, color: theme.textDim }}>
      {'<'}- select a skill source or skill
    </div>
  );
}
