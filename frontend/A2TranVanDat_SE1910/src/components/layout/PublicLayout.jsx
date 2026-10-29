import React from "react";
import Header from "./Header";

export default function PublicLayout({ children }) {
  return (
    <div className="main-content">
      <Header />
      <main className="content-outlet">{children}</main>
    </div>
  );
}
