import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const ApiNode = ({ id, data }) => {
  const [url, setUrl] = useState(data?.url || '');
  const [method, setMethod] = useState(data?.method || 'GET');
  const updateNodeField = useStore((s) => s.updateNodeField);

  const handles = [
    { type: 'target', position: 'left', id: `${id}-body`, label: 'body', style: { top: '40%' } },
    { type: 'target', position: 'left', id: `${id}-headers`, label: 'headers', style: { top: '70%' } },
    { type: 'source', position: 'right', id: `${id}-response` },
  ];

  return (
    <BaseNode id={id} title="API Call" handles={handles} headerColor="linear-gradient(90deg, #0ea5e9, #38bdf8)">
      <label style={labelStyle}>
        Method
        <select
          style={selectStyle}
          value={method}
          onChange={(e) => { setMethod(e.target.value); updateNodeField(id, 'method', e.target.value); }}
        >
          {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </label>
      <label style={labelStyle}>
        URL
        <input
          style={inputStyle}
          type="text"
          placeholder="https://api.example.com/..."
          value={url}
          onChange={(e) => { setUrl(e.target.value); updateNodeField(id, 'url', e.target.value); }}
        />
      </label>
    </BaseNode>
  );
};

const labelStyle = { display: 'flex', flexDirection: 'column', fontSize: 11, color: '#94a3b8', marginBottom: 6, gap: 3 };
const inputStyle = { background: '#0f0f1a', border: '1px solid #4a4a6a', borderRadius: 5, color: '#e2e8f0', padding: '3px 7px', fontSize: 12, outline: 'none' };
const selectStyle = { ...inputStyle };
