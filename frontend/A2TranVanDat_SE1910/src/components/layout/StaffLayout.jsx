import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function StaffLayout({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="content-outlet">{children}</main>
      </div>
    </div>
  );
}
