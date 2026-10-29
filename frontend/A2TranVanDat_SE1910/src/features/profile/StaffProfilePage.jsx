import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { accountApi } from "../../api/accountApi";
import InputField from "../../components/common/InputField";

export default function StaffProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    try {
      await accountApi.update(user.id, {
        id: user.id,
        name: name.trim(),
        email: user.email,
        role: user.role,
        password: password.trim() ? password : null,
      });
      if (updateUser) {
        updateUser({ name: name.trim() });
      }
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setPassword("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Update failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "540px" }}>
      <div className="page-header">
        <h2 className="page-title">My Profile</h2>
      </div>

      <div className="card">
        {message.text && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "6px",
              marginBottom: "16px",
              fontSize: "13px",
              background: message.type === "success" ? "#dcfce7" : "#fee2e2",
              color: message.type === "success" ? "#166534" : "#991b1b",
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleUpdate}>
          <InputField label="Account ID" value={user?.id || ""} disabled />
          <InputField
            label="Email Address"
            value={user?.email || ""}
            disabled
          />
          <InputField
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ marginTop: "10px" }}
          >
            {loading ? "Saving..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
