import { DraggableNode } from './draggableNode';

const NODE_CONFIGS = [
  { type: 'customInput', label: 'Input', color: '#22c55e' },
  { type: 'llm', label: 'LLM', color: '#8b5cf6' },
  { type: 'customOutput', label: 'Output', color: '#f59e0b' },
  { type: 'text', label: 'Text', color: '#06b6d4' },
  { type: 'filter', label: 'Filter', color: '#ef4444' },
  { type: 'api', label: 'API Call', color: '#0ea5e9' },
  { type: 'transform', label: 'Transform', color: '#d97706' },
  { type: 'note', label: 'Note', color: '#64748b' },
  { type: 'merge', label: 'Merge', color: '#7c3aed' },
];

export const PipelineToolbar = () => {
  return (
    <div
      style={{
        padding: '12px 16px',
        background: 'linear-gradient(90deg, #0f0f1a, #1a1a2e)',
        borderBottom: '1px solid #2d2d4e',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <span
        style={{
          color: '#a78bfa',
          fontWeight: 700,
          fontSize: 16,
          letterSpacing: 1,
          fontFamily: "'Inter', sans-serif",
          whiteSpace: 'nowrap',
        }}
      >
        VectorShift
      </span>
      <div style={{ width: 1, height: 36, background: '#2d2d4e' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {NODE_CONFIGS.map(({ type, label, color }) => (
          <DraggableNode key={type} type={type} label={label} color={color} />
        ))}
      </div>
    </div>
  );
};
