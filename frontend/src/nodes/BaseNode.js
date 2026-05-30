// Reusable base for all pipeline nodes — wraps a consistent card shell
// and renders typed handles from a declarative config.

import { Handle, Position } from 'reactflow';

const HANDLE_POSITION = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom,
};

/**
 * handles: Array<{
 *   type: 'source' | 'target',
 *   position: 'left' | 'right' | 'top' | 'bottom',
 *   id: string,
 *   style?: object,
 *   label?: string,
 * }>
 */
export const BaseNode = ({ id, title, handles = [], children, style = {}, headerColor }) => {
  return (
    <div
      className="base-node"
      style={{
        minWidth: 220,
        minHeight: 90,
        border: '1px solid #4a4a6a',
        borderRadius: 10,
        background: 'linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        fontFamily: "'Inter', sans-serif",
        overflow: 'visible',
        position: 'relative',
        ...style,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: headerColor || 'linear-gradient(90deg, #6c63ff, #a78bfa)',
          borderRadius: '9px 9px 0 0',
          padding: '6px 12px',
          fontSize: 12,
          fontWeight: 700,
          color: '#fff',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        }}
      >
        {title}
      </div>

      {/* Body */}
      <div style={{ padding: '10px 12px 12px', color: '#cdd6f4' }}>
        {children}
      </div>

      {/* Handles */}
      {handles.map((h) => (
        <Handle
          key={h.id}
          type={h.type}
          position={HANDLE_POSITION[h.position]}
          id={h.id}
          style={{
            background: h.type === 'source' ? '#a78bfa' : '#7dd3fc',
            border: '2px solid #1e1e2e',
            width: 10,
            height: 10,
            ...h.style,
          }}
        />
      ))}

      {/* Handle labels rendered near each handle */}
      {handles
        .filter((h) => h.label)
        .map((h) => {
          const isLeft = h.position === 'left';
          const isRight = h.position === 'right';
          const topVal = h.style?.top || '50%';
          return (
            <div
              key={`label-${h.id}`}
              style={{
                position: 'absolute',
                top: topVal,
                left: isLeft ? 14 : undefined,
                right: isRight ? 14 : undefined,
                transform: 'translateY(-50%)',
                fontSize: 10,
                color: '#94a3b8',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {h.label}
            </div>
          );
        })}
    </div>
  );
};
