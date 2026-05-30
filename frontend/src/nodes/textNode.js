import { useState, useEffect, useRef } from "react";
import {
  Handle,
  Position,
  useUpdateNodeInternals,
} from "reactflow";
import { useStore } from "../store";

const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;
const NODE_WIDTH = 250;

function extractVariables(text) {
  const vars = [];
  let match;
  const re = new RegExp(VARIABLE_REGEX.source, "g");

  while ((match = re.exec(text)) !== null) {
    if (!vars.includes(match[1])) {
      vars.push(match[1]);
    }
  }

  return vars;
}

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || "{{input}}");
  const updateNodeField = useStore((s) => s.updateNodeField);

  const textareaRef = useRef(null);
  const updateNodeInternals = useUpdateNodeInternals();

  const variables = extractVariables(currText);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        `${textareaRef.current.scrollHeight}px`;
    }
  }, [currText]);

  useEffect(() => {
    updateNodeInternals(id);
  }, [variables, id, updateNodeInternals]);

  const handleChange = (e) => {
    const value = e.target.value;

    setCurrText(value);
    updateNodeField(id, "text", value);
  };

  return (
    <div
      style={{
        width: NODE_WIDTH,
        minWidth: NODE_WIDTH,
        border: "1px solid #4a4a6a",
        borderRadius: 10,
        background: "linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(90deg, #06b6d4, #38bdf8)",
          borderRadius: "9px 9px 0 0",
          padding: "6px 12px",
          fontSize: 12,
          fontWeight: 700,
          color: "#fff",
          letterSpacing: 0.5,
          textTransform: "uppercase",
        }}
      >
        Text
      </div>

      {/* Body */}
      <div
        style={{
          padding: "10px 12px 12px",
          color: "#cdd6f4",
        }}
      >
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 11,
            color: "#94a3b8",
            gap: 3,
          }}
        >
          Text
          <textarea
            ref={textareaRef}
            value={currText}
            onChange={handleChange}
            rows={1}
            placeholder="Enter text..."
            style={{
              background: "#0f0f1a",
              border: "1px solid #4a4a6a",
              borderRadius: 5,
              color: "#e2e8f0",
              padding: "6px 8px",
              fontSize: 12,
              outline: "none",
              resize: "none",
              overflow: "hidden",
              width: "100%",
              boxSizing: "border-box",
              fontFamily: "inherit",
              lineHeight: 1.5,
            }}
          />
        </label>

        {variables.length > 0 && (
          <div
            style={{
              marginTop: 8,
              display: "flex",
              gap: 4,
              flexWrap: "wrap",
            }}
          >
            {variables.map((v) => (
              <span
                key={v}
                style={{
                  fontSize: 10,
                  background: "#1e3a5f",
                  color: "#7dd3fc",
                  borderRadius: 4,
                  padding: "2px 6px",
                }}
              >
                {`{{${v}}}`}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic Variable Handles */}
      {variables.map((v, i) => (
        <Handle
          key={`var-${v}`}
          type="target"
          position={Position.Left}
          id={`${id}-${v}`}
          style={{
            top: `${((i + 1) / (variables.length + 1)) * 100}%`,
            background: "#7dd3fc",
            border: "2px solid #1e1e2e",
            width: 10,
            height: 10,
          }}
        >
          <span
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 10,
              color: "#94a3b8",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            {v}
          </span>
        </Handle>
      ))}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{
          background: "#a78bfa",
          border: "2px solid #1e1e2e",
          width: 10,
          height: 10,
        }}
      />
    </div>
  );
};