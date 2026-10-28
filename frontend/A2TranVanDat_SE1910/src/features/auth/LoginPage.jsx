import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { validateLogin } from "../../utils/validation";
import InputField from "../../components/common/InputField";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const validation = validateLogin({ email, password });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 1) {
        navigate("/admin/accounts");
      } else {
        navigate("/staff/news");
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div className="card" style={{ maxWidth: "420px", width: "100%" }}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            marginBottom: "6px",
            textAlign: "center",
          }}
        >
          FUNews Staff & Admin Portal
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-muted)",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Sign in to manage news, accounts and categories
        </p>

        {serverError && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "10px 14px",
              borderRadius: "6px",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <InputField
            label="Email Address"
            type="email"
            placeholder="e.g. admin@funews.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
          />

          <InputField
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
          />

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "10px" }}
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Link
            to="/"
            style={{
              color: "var(--primary)",
              fontSize: "13px",
              textDecoration: "none",
            }}
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}
