import React, { useState, useEffect } from "react";
import InputField from "../../components/common/InputField";
import { validateCategory } from "../../utils/validation";

export default function CategoryModal({
  isOpen,
  mode,
  initialData,
  categories,
  onClose,
  onSave,
}) {
  const [name, setName] = useState(() => initialData?.name || "");
  const [description, setDescription] = useState(
    () => initialData?.description || "",
  );
  const [parentId, setParentId] = useState(() =>
    initialData?.parentId ? String(initialData.parentId) : "",
  );
  const [isActive, setIsActive] = useState(
    () => initialData?.isActive ?? true,
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && mode === "UPDATE") {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setParentId(initialData.parentId ? String(initialData.parentId) : "");
      setIsActive(initialData.isActive ?? true);
    } else {
      setName("");
      setDescription("");
      setParentId("");
      setIsActive(true);
    }
    setErrors({});
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateCategory({ name });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      parentId: parentId ? Number(parentId) : null,
      isActive,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: "520px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ margin: 0 }}>
            {mode === "CREATE" ? "Add New Category" : "Edit Category"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              color: "var(--text-muted)",
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === "UPDATE" && (
            <InputField
              label="Category ID"
              value={initialData?.id || ""}
              disabled
            />
          )}

          <InputField
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            required
          />

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows="3"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter category description..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Parent Category</label>
            <select
              className="form-control"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
            >
              <option value="">-- None (Root Category) --</option>
              {categories
                .filter((c) => mode === "CREATE" || c.id !== initialData?.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-control"
              value={isActive ? 1 : 0}
              onChange={(e) => setIsActive(Number(e.target.value) === 1)}
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
