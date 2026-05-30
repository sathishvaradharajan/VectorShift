import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({ nodes: state.nodes, edges: state.edges });

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        alert(`Error: server responded with status ${response.status}`);
        return;
      }

      const { num_nodes, num_edges, is_dag } = await response.json();

      alert(
        `Pipeline Analysis\n` +
        `─────────────────\n` +
        `Nodes:  ${num_nodes}\n` +
        `Edges:  ${num_edges}\n` +
        `Is DAG: ${is_dag ? 'Yes ✓' : 'No ✗ (contains a cycle)'}`
      );
    } catch (err) {
      alert(`Failed to reach backend.\nMake sure the server is running at http://localhost:8000\n\n${err.message}`);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 0',
        background: 'linear-gradient(90deg, #0f0f1a, #1a1a2e)',
        borderTop: '1px solid #2d2d4e',
      }}
    >
      <button
        onClick={handleSubmit}
        style={{
          background: 'linear-gradient(90deg, #6c63ff, #a78bfa)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '10px 36px',
          fontSize: 14,
          fontWeight: 700,
          fontFamily: "'Inter', sans-serif",
          cursor: 'pointer',
          letterSpacing: 0.5,
          boxShadow: '0 4px 15px rgba(108,99,255,0.4)',
          transition: 'transform 0.1s, box-shadow 0.1s',
        }}
        onMouseOver={(e) => { e.target.style.transform = 'scale(1.03)'; }}
        onFocus={(e) => { e.target.style.transform = 'scale(1.03)'; }}
        onMouseOut={(e) => { e.target.style.transform = 'scale(1)'; }}
        onBlur={(e) => { e.target.style.transform = 'scale(1)'; }}
      >
        Submit Pipeline
      </button>
    </div>
  );
};
