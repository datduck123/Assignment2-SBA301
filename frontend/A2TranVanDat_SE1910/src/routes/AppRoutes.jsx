import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import PublicLayout from "../components/layout/PublicLayout";
import AdminLayout from "../components/layout/AdminLayout";
import StaffLayout from "../components/layout/StaffLayout";

import AdminRoute from "./AdminRoute";
import StaffRoute from "./StaffRoute";

import PublicNewsPage from "../features/public/PublicNewsPage";
import PublicNewsTablePage from "../features/public/PublicNewsTablePage";
import NewsDetailPage from "../features/public/NewsDetailPage";
import LoginPage from "../features/auth/LoginPage";

import AccountListPage from "../features/accounts/AccountListPage";
import CategoryListPage from "../features/categories/CategoryListPage";
import NewsListPage from "../features/news/NewsListPage";
import MyNewsHistoryPage from "../features/profile/MyNewsHistoryPage";
import StaffProfilePage from "../features/profile/StaffProfilePage";

function RootRoute() {
  const { isAdmin, isStaff } = useAuth();
  if (isAdmin) {
    return <Navigate to="/admin/public-news" replace />;
  }
  if (isStaff) {
    return <Navigate to="/staff/public-news" replace />;
  }
  return (
    <PublicLayout>
      <PublicNewsPage />
    </PublicLayout>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Public Routes: No login required */}
      <Route path="/" element={<RootRoute />} />
      <Route
        path="/news/:id"
        element={
          <PublicLayout>
            <NewsDetailPage />
          </PublicLayout>
        }
      />
      <Route path="/login" element={<LoginPage />} />

      {/* 2. Admin Routes: Role = 1 */}
      <Route element={<AdminRoute />}>
        <Route
          path="/admin/accounts"
          element={
            <AdminLayout>
              <AccountListPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/public-news"
          element={
            <AdminLayout>
              <PublicNewsTablePage />
            </AdminLayout>
          }
        />
      </Route>

      {/* 3. Staff Routes: Role = 2 */}
      <Route element={<StaffRoute />}>
        <Route
          path="/staff/public-news"
          element={
            <StaffLayout>
              <PublicNewsTablePage />
            </StaffLayout>
          }
        />
        <Route
          path="/staff/categories"
          element={
            <StaffLayout>
              <CategoryListPage />
            </StaffLayout>
          }
        />
        <Route
          path="/staff/news"
          element={
            <StaffLayout>
              <NewsListPage />
            </StaffLayout>
          }
        />
        <Route
          path="/staff/history"
          element={
            <StaffLayout>
              <MyNewsHistoryPage />
            </StaffLayout>
          }
        />
        <Route
          path="/staff/profile"
          element={
            <StaffLayout>
              <StaffProfilePage />
            </StaffLayout>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
