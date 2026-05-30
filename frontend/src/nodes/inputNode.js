import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data.inputType || 'Text');
  const updateNodeField = useStore((s) => s.updateNodeField);

  const handles = [
    { type: 'source', position: 'right', id: `${id}-value` },
  ];

  return (
    <BaseNode id={id} title="Input" handles={handles} headerColor="linear-gradient(90deg, #22c55e, #4ade80)">
      <label style={labelStyle}>
        Name
        <input
          style={inputStyle}
          type="text"
          value={currName}
          onChange={(e) => { setCurrName(e.target.value); updateNodeField(id, 'inputName', e.target.value); }}
        />
      </label>
      <label style={labelStyle}>
        Type
        <select
          style={selectStyle}
          value={inputType}
          onChange={(e) => { setInputType(e.target.value); updateNodeField(id, 'inputType', e.target.value); }}
        >
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </label>
    </BaseNode>
  );
};

const labelStyle = { display: 'flex', flexDirection: 'column', fontSize: 11, color: '#94a3b8', marginBottom: 6, gap: 3 };
const inputStyle = { background: '#0f0f1a', border: '1px solid #4a4a6a', borderRadius: 5, color: '#e2e8f0', padding: '3px 7px', fontSize: 12, outline: 'none' };
const selectStyle = { ...inputStyle };
