// src/components/Layout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./Layout.css";

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Toggle sidebar
  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className={`app-layout ${collapsed ? "sidebar-collapsed" : ""}`}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* MAIN AREA */}
      <div className="main-wrapper">
        {/* ✅ TOP BAR */}
        <header className="topbar">
          {/* ✅ Mobile menu button */}
          <button className="menu-btn" onClick={toggleSidebar}>
            ☰
          </button>

          <h1 className="topbar-title">Salah Apartments</h1>
        </header>

        {/* PAGE CONTENT */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
