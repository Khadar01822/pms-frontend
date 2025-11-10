import React from "react";
import { Link, useLocation } from "react-router-dom";
import "..styles/Sidebar.css";

function Sidebar({ isOpen, toggle }) {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "Apartments", path: "/apartments" },
    { name: "Tenants", path: "/tenants" },
    { name: "Payments", path: "/payments" },
    { name: "Maintenance", path: "/maintenance" },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2>PMS</h2>
        <button className="close-btn" onClick={toggle}>
          ✖
        </button>
      </div>

      <nav className="sidebar-menu">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={toggle} // close sidebar on mobile
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
