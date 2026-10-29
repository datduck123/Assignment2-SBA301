import React from "react";

export default function TagSelector({ tags, selectedTagIds, onChange }) {
  const handleToggle = (tagId) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        marginTop: "6px",
      }}
    >
      {tags.map((t) => {
        const isSelected = selectedTagIds.includes(t.id);
        return (
          <button
            key={t.id}
            type="button"
            className={`btn btn-sm ${isSelected ? "btn-primary" : "btn-secondary"}`}
            onClick={() => handleToggle(t.id)}
          >
            #{t.name}
          </button>
        );
      })}
    </div>
  );
}
