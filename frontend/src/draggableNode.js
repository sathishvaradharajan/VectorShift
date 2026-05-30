export const DraggableNode = ({ type, label, color }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType }));
    event.dataTransfer.effectAllowed = 'move';
    event.target.style.cursor = 'grabbing';
  };

  return (
    <div
      className={type}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      draggable
      style={{
        cursor: 'grab',
        minWidth: 75,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        background: '#1c2536',
        border: `1px solid ${color || '#4a4a6a'}`,
        boxShadow: `0 0 8px ${color ? color + '44' : 'transparent'}`,
        transition: 'box-shadow 0.2s',
        padding: '0 12px',
      }}
    >
      <span
        style={{
          color: color || '#e2e8f0',
          fontSize: 12,
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          userSelect: 'none',
        }}
      >
        {label}
      </span>
    </div>
  );
};
