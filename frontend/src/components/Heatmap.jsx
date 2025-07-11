
import React from 'react';
import '../styles/Heatmap.css';

export default function Heatmap({ data = [] }) {
  const cells = (data.length >= 42
    ? data.slice(-42)
    : Array.from({ length: 42 - data.length }).fill(0).concat(data)
  );

  const max = Math.max(...cells);          // used for opacity scale
  const getOpacity = v =>
    max === 0 ? 0.15 : 0.15 + (v / max) * 0.85; // 0.15-1.0 range

  return (
    <div className="heatmap">
      {cells.map((v, i) => (
        <div
          key={i}
          className="heat-cell"
          title={`${v} solved`}
          style={{
            backgroundColor: `rgba(74,168,255,${getOpacity(v)})`
          }}
        />
      ))}
    </div>
  );
}
