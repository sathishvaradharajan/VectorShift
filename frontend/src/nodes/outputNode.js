import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data.outputType || 'Text');
  const updateNodeField = useStore((s) => s.updateNodeField);

  const handles = [
    { type: 'target', position: 'left', id: `${id}-value` },
  ];

  return (
    <BaseNode id={id} title="Output" handles={handles} headerColor="linear-gradient(90deg, #f59e0b, #fbbf24)">
      <label style={labelStyle}>
        Name
        <input
          style={inputStyle}
          type="text"
          value={currName}
          onChange={(e) => { setCurrName(e.target.value); updateNodeField(id, 'outputName', e.target.value); }}
        />
      </label>
      <label style={labelStyle}>
        Type
        <select
          style={selectStyle}
          value={outputType}
          onChange={(e) => { setOutputType(e.target.value); updateNodeField(id, 'outputType', e.target.value); }}
        >
          <option value="Text">Text</option>
          <option value="Image">Image</option>
        </select>
      </label>
    </BaseNode>
  );
};

const labelStyle = { display: 'flex', flexDirection: 'column', fontSize: 11, color: '#94a3b8', marginBottom: 6, gap: 3 };
const inputStyle = { background: '#0f0f1a', border: '1px solid #4a4a6a', borderRadius: 5, color: '#e2e8f0', padding: '3px 7px', fontSize: 12, outline: 'none' };
const selectStyle = { ...inputStyle };
