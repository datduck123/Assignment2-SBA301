import React, { useState, useEffect } from "react";
import InputField from "../../components/common/InputField";
import { validateAccount } from "../../utils/validation";

export default function AccountModal({
  isOpen,
  mode,
  initialData,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    role: 2,
    password: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && mode === "UPDATE") {
      setFormData({
        id: initialData.accountId,
        name: initialData.name,
        email: initialData.email,
        role: initialData.role,
        password: "",
      });
    } else {
      setFormData({ id: "", name: "", email: "", role: 2, password: "" });
    }
    setErrors({});
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateAccount(formData, mode === "UPDATE");
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSave(formData);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>{mode === "CREATE" ? "Add New Account" : "Edit Account"}</h3>
        <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
          <InputField
            label="Account ID"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            disabled={mode === "UPDATE"}
            error={errors.id}
            required
          />
          <InputField
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />
          <InputField
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            disabled={mode === "UPDATE"}
            error={errors.email}
            required
          />
          <div className="form-group">
            <label className="form-label">System Role</label>
            <select
              className="form-control"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: Number(e.target.value) })
              }
            >
              <option value={1}>Admin (Role 1)</option>
              <option value={2}>Staff (Role 2)</option>
            </select>
          </div>
          <InputField
            label={
              mode === "UPDATE"
                ? "Password (Leave blank to keep unchanged)"
                : "Initial Password"
            }
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            error={errors.password}
            required={mode === "CREATE"}
          />

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
