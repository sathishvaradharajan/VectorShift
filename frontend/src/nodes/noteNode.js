import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const NoteNode = ({ id, data }) => {
  const [note, setNote] = useState(data?.note || '');
  const updateNodeField = useStore((s) => s.updateNodeField);

  return (
    <BaseNode id={id} title="Note" handles={[]} headerColor="linear-gradient(90deg, #64748b, #94a3b8)">
      <textarea
        value={note}
        onChange={(e) => { setNote(e.target.value); updateNodeField(id, 'note', e.target.value); }}
        placeholder="Add a comment or annotation..."
        rows={3}
        style={{
          background: '#0f0f1a',
          border: '1px solid #4a4a6a',
          borderRadius: 5,
          color: '#e2e8f0',
          padding: '4px 8px',
          fontSize: 12,
          outline: 'none',
          resize: 'none',
          width: '100%',
          boxSizing: 'border-box',
          fontFamily: 'inherit',
        }}
      />
    </BaseNode>
  );
};
