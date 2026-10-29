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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && mode === "UPDATE") {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setParentId(initialData.parentId || "");
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
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>{mode === "CREATE" ? "Add New Category" : "Edit Category"}</h3>
        <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
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
