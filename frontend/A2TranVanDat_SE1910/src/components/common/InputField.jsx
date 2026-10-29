import React from "react";

export default function InputField({ label, error, required, ...props }) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
        </label>
      )}
      <input className="form-control" {...props} />
      {error && <div className="error-text">{error}</div>}
    </div>
  );
}
