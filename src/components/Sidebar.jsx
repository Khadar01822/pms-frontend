// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  Building2,
  CreditCard,
  Wrench,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/" },
    { name: "Apartments", icon: <Building2 size={20} />, path: "/apartments" },
    { name: "Tenants", icon: <Users size={20} />, path: "/tenants" },
    { name: "Payments", icon: <CreditCard size={20} />, path: "/payments" },
    { name: "Maintenance", icon: <Wrench size={20} />, path: "/maintenance" },

  ];

  return (
    <aside className={`app-sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Top Section */}
      <div>
        <div className="sidebar-brand"></div>
        <nav className="sidebar-nav">
          {menuItems.map((item, i) => (
            <NavLink
              to={item.path}
              key={i}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <span className="sidebar-icon">{item.icon}</span>
              {!collapsed && <span className="sidebar-text">{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
          {/* Bottom Section */}
<div className="p-4 border-t border-blue-200 dark:border-gray-700 space-y-4">
  {/* Logout button */}
  <button
    onClick={() => alert("Logging out...")}
    className="flex items-center justify-center gap-2 w-full py-2.5 
    bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold 
    rounded-full shadow-md hover:from-red-600 hover:to-red-700 
    hover:shadow-red-300/40 active:scale-95 transition-all duration-300"
  >
    <LogOut size={18} />
    {!collapsed && <span>Logout</span>}
  </button>

  {/* Collapse toggle */}
  <div className="center">
    <button
      onClick={() => setCollapsed(!collapsed)}
      className="flex items-center justify-center p-2.5 
      bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full 
      shadow-md hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-400/40 
      active:scale-95 transition-all duration-300"
      title={collapsed ? "Expand Menu" : "Collapse Menu"}
    >
      {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
    </button>
  </div>
</div>

     
    </aside>
  );
};

export default Sidebar;
