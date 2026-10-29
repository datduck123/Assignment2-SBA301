import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="brand-wrapper">
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span className="brand-title">FUNews Management</span>
        </Link>
      </div>

      <div className="header-right">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={toggleTheme}
        >
          {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
        </button>

        {user ? (
          <>
            <span style={{ fontSize: "14px", color: "var(--text-main)" }}>
              Welcome, <strong>{user.name}</strong> (
              {user.role === 1 ? "Admin" : "Staff"})
            </span>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">
            Staff / Admin Login
          </Link>
        )}
      </div>
    </header>
  );
}
