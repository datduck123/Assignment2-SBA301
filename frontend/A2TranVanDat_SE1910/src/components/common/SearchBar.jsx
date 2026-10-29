import React from "react";

export default function SearchBar({
  keyword,
  onSearchChange,
  placeholder = "Search...",
}) {
  return (
    <div
      style={{ display: "flex", gap: "8px", maxWidth: "400px", width: "100%" }}
    >
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={keyword}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {keyword && (
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onSearchChange("")}
        >
          Clear
        </button>
      )}
    </div>
  );
}
