import React from "react";

export default function Pagination({ pageNumber, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "8px",
        marginTop: "16px",
      }}
    >
      <button
        className="btn btn-secondary btn-sm"
        disabled={pageNumber === 0}
        onClick={() => onPageChange(pageNumber - 1)}
      >
        Previous
      </button>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: "13px",
          color: "var(--text-muted)",
        }}
      >
        Page {pageNumber + 1} of {totalPages}
      </span>
      <button
        className="btn btn-secondary btn-sm"
        disabled={pageNumber >= totalPages - 1}
        onClick={() => onPageChange(pageNumber + 1)}
      >
        Next
      </button>
    </div>
  );
}
