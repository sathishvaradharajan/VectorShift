import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  const handles = [
    { type: 'target', position: 'left', id: `${id}-system`, label: 'system', style: { top: '33%' ,left: '0%'} },
    { type: 'target', position: 'left', id: `${id}-prompt`, label: 'prompt', style: { top: '67%' } },
    { type: 'source', position: 'right', id: `${id}-response`, label: 'response' },
  ];

  return (
    <BaseNode id={id} title="LLM" handles={handles} headerColor="linear-gradient(90deg, #8b5cf6, #a78bfa)">
      <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>
        Large Language Model
      </p>
      <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {['system', 'prompt'].map((label) => (
          <span key={label} style={chipStyle}>{label}</span>
        ))}
        <span style={{ ...chipStyle, background: '#2e1065', color: '#c4b5fd' }}>→ response</span>
      </div>
    </BaseNode>
  );
};

const chipStyle = {
  fontSize: 10,
  background: '#1e3a5f',
  color: '#7dd3fc',
  borderRadius: 4,
  padding: '2px 6px',
};
