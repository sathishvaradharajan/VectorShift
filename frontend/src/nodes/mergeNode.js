import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const MergeNode = ({ id, data }) => {
  const [separator, setSeparator] = useState(data?.separator || '\\n');
  const updateNodeField = useStore((s) => s.updateNodeField);

  const handles = [
    { type: 'target', position: 'left', id: `${id}-a`, label: 'A', style: { top: '33%' } },
    { type: 'target', position: 'left', id: `${id}-b`, label: 'B', style: { top: '67%' } },
    { type: 'source', position: 'right', id: `${id}-merged` },
  ];

  return (
    <BaseNode id={id} title="Merge" handles={handles} headerColor="linear-gradient(90deg, #7c3aed, #8b5cf6)">
      <label style={labelStyle}>
        Separator
        <input
          style={inputStyle}
          type="text"
          value={separator}
          placeholder="\n or , or space"
          onChange={(e) => { setSeparator(e.target.value); updateNodeField(id, 'separator', e.target.value); }}
        />
      </label>
      <p style={{ margin: '4px 0 0', fontSize: 10, color: '#64748b' }}>
        Joins inputs A + B with separator
      </p>
    </BaseNode>
  );
};

const labelStyle = { display: 'flex', flexDirection: 'column', fontSize: 11, color: '#94a3b8', marginBottom: 6, gap: 3 };
const inputStyle = { background: '#0f0f1a', border: '1px solid #4a4a6a', borderRadius: 5, color: '#e2e8f0', padding: '3px 7px', fontSize: 12, outline: 'none' };
