import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function StaffRoute() {
  const { user, isStaff } = useAuth();
  if (!user || !isStaff) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
