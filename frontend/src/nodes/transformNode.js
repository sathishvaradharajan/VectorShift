import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

const TRANSFORMS = ['Uppercase', 'Lowercase', 'Trim', 'JSON Parse', 'JSON Stringify', 'Base64 Encode', 'Base64 Decode'];

export const TransformNode = ({ id, data }) => {
  const [transform, setTransform] = useState(data?.transform || 'Uppercase');
  const updateNodeField = useStore((s) => s.updateNodeField);

  const handles = [
    { type: 'target', position: 'left', id: `${id}-input` },
    { type: 'source', position: 'right', id: `${id}-output` },
  ];

  return (
    <BaseNode id={id} title="Transform" handles={handles} headerColor="linear-gradient(90deg, #d97706, #f59e0b)">
      <label style={labelStyle}>
        Operation
        <select
          style={selectStyle}
          value={transform}
          onChange={(e) => { setTransform(e.target.value); updateNodeField(id, 'transform', e.target.value); }}
        >
          {TRANSFORMS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </label>
      <p style={{ margin: '4px 0 0', fontSize: 10, color: '#64748b' }}>
        Applies a string/data transformation
      </p>
    </BaseNode>
  );
};

const labelStyle = { display: 'flex', flexDirection: 'column', fontSize: 11, color: '#94a3b8', marginBottom: 6, gap: 3 };
const selectStyle = { background: '#0f0f1a', border: '1px solid #4a4a6a', borderRadius: 5, color: '#e2e8f0', padding: '3px 7px', fontSize: 12, outline: 'none' };
