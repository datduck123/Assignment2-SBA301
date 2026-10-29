import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { isAdmin, isStaff } = useAuth();
  const publicNewsPath = isAdmin
    ? "/admin/public-news"
    : isStaff
      ? "/staff/public-news"
      : "/";

  return (
    <aside className="app-sidebar">
      <div className="sidebar-title">NAVIGATION MENU</div>
      <nav className="sidebar-nav">
        <NavLink
          to={publicNewsPath}
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          📰 Public News Portal
        </NavLink>

        {isAdmin && (
          <>
            <div className="sidebar-title" style={{ marginTop: "16px" }}>
              ADMINISTRATION
            </div>
            <NavLink
              to="/admin/accounts"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              👥 Account Management
            </NavLink>
          </>
        )}

        {isStaff && (
          <>
            <div className="sidebar-title" style={{ marginTop: "16px" }}>
              STAFF WORKSPACE
            </div>
            <NavLink
              to="/staff/categories"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              📁 Category Management
            </NavLink>
            <NavLink
              to="/staff/news"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              📝 News Articles CRUD
            </NavLink>
            <NavLink
              to="/staff/history"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              📜 My News History
            </NavLink>
            <NavLink
              to="/staff/profile"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              👤 My Profile
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}
