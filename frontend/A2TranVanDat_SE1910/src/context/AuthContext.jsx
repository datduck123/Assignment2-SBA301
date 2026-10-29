import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/authApi";
import { ROLES } from "../utils/constants";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const userData = {
      id: res.accountId,
      name: res.name,
      email: res.email,
      role: res.role,
    };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", res.token);
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  const isAdmin = user?.role === ROLES.ADMIN;
  const isStaff = user?.role === ROLES.STAFF;

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, isStaff, login, logout, updateUser, theme, toggleTheme }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
