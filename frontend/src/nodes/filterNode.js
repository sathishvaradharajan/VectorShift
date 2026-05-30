import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const FilterNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || '');
  const updateNodeField = useStore((s) => s.updateNodeField);

  const handles = [
    { type: 'target', position: 'left', id: `${id}-input` },
    { type: 'source', position: 'right', id: `${id}-pass`, label: 'pass', style: { top: '35%' } },
    { type: 'source', position: 'right', id: `${id}-fail`, label: 'fail', style: { top: '65%' } },
  ];

  return (
    <BaseNode id={id} title="Filter" handles={handles} headerColor="linear-gradient(90deg, #ef4444, #f87171)">
      <label style={labelStyle}>
        Condition
        <input
          style={inputStyle}
          type="text"
          placeholder="e.g. value > 0"
          value={condition}
          onChange={(e) => { setCondition(e.target.value); updateNodeField(id, 'condition', e.target.value); }}
        />
      </label>
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <span style={{ ...chipStyle, background: '#14532d', color: '#86efac' }}>✓ pass</span>
        <span style={{ ...chipStyle, background: '#450a0a', color: '#fca5a5' }}>✗ fail</span>
      </div>
    </BaseNode>
  );
};

const labelStyle = { display: 'flex', flexDirection: 'column', fontSize: 11, color: '#94a3b8', marginBottom: 6, gap: 3 };
const inputStyle = { background: '#0f0f1a', border: '1px solid #4a4a6a', borderRadius: 5, color: '#e2e8f0', padding: '3px 7px', fontSize: 12, outline: 'none' };
const chipStyle = { fontSize: 10, borderRadius: 4, padding: '2px 6px' };
