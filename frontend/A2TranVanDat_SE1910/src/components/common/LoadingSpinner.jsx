import React from "react";

export default function LoadingSpinner() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px 0",
        color: "var(--text-muted)",
      }}
    >
      <div style={{ fontSize: "18px", fontWeight: 600 }}>Loading data...</div>
    </div>
  );
}
