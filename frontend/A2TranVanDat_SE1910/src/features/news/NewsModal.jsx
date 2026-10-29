import React, { useState, useEffect } from "react";
import InputField from "../../components/common/InputField";
import TagSelector from "./components/TagSelector";
import { validateNews } from "../../utils/validation";

export default function NewsModal({
  isOpen,
  mode,
  initialData,
  categories,
  tags,
  staffId,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState(() => {
    if (initialData && mode === "UPDATE") {
      return {
        id: initialData.id || "",
        title: initialData.title || "",
        headline: initialData.headline || "",
        content: initialData.content || "",
        source: initialData.source || "",
        categoryId: initialData.categoryId
          ? String(initialData.categoryId)
          : categories[0]?.id
            ? String(categories[0].id)
            : "",
        status: initialData.status ?? true,
        tagIds: initialData.tags?.map((t) => t.id) || [],
      };
    }
    return {
      id: "",
      title: "",
      headline: "",
      content: "",
      source: "",
      categoryId: categories[0]?.id ? String(categories[0].id) : "",
      status: true,
      tagIds: [],
    };
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && mode === "UPDATE") {
      setFormData({
        id: initialData.id || "",
        title: initialData.title || "",
        headline: initialData.headline || "",
        content: initialData.content || "",
        source: initialData.source || "",
        categoryId: initialData.categoryId
          ? String(initialData.categoryId)
          : categories[0]?.id
            ? String(categories[0].id)
            : "",
        status: initialData.status ?? true,
        tagIds: initialData.tags?.map((t) => t.id) || [],
      });
    } else {
      setFormData({
        id: "",
        title: "",
        headline: "",
        content: "",
        source: "",
        categoryId: categories[0]?.id ? String(categories[0].id) : "",
        status: true,
        tagIds: [],
      });
    }
    setErrors({});
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateNews(formData, mode === "UPDATE");
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSave({
      ...formData,
      categoryId: Number(formData.categoryId),
      createdById: staffId,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        style={{
          maxWidth: "680px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
            position: "sticky",
            top: 0,
            background: "var(--bg-card)",
            zIndex: 10,
            paddingBottom: "8px",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "18px" }}>
            {mode === "CREATE" ? "Add New News Article" : "Edit News Article"}
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

        <form onSubmit={handleSubmit} style={{ flex: 1 }}>
          <InputField
            label="Article ID"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            disabled={mode === "UPDATE"}
            error={errors.id}
            required
          />

          <InputField
            label="Article Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            error={errors.title}
            required
          />

          <InputField
            label="Headline"
            value={formData.headline}
            onChange={(e) =>
              setFormData({ ...formData, headline: e.target.value })
            }
            error={errors.headline}
            required
          />

          <div className="form-group">
            <label className="form-label">
              Category <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              className="form-control"
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <div className="error-text">{errors.categoryId}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              News Content <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              rows="6"
              className="form-control"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Enter full news article content..."
            />
            {errors.content && (
              <div className="error-text">{errors.content}</div>
            )}
          </div>

          <InputField
            label="News Source"
            value={formData.source}
            onChange={(e) =>
              setFormData({ ...formData, source: e.target.value })
            }
            placeholder="e.g. CNN, Internet, Campus Office"
          />

          <div className="form-group">
            <label className="form-label">Associated Tags</label>
            <TagSelector
              tags={tags}
              selectedTagIds={formData.tagIds}
              onChange={(newIds) =>
                setFormData({ ...formData, tagIds: newIds })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Publishing Status</label>
            <select
              className="form-control"
              value={formData.status ? 1 : 0}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: Number(e.target.value) === 1,
                })
              }
            >
              <option value={1}>Active (Visible to public)</option>
              <option value={0}>Inactive (Hidden)</option>
            </select>
          </div>

          <div
            className="modal-footer"
            style={{
              position: "sticky",
              bottom: 0,
              background: "var(--bg-card)",
              zIndex: 10,
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Article
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
