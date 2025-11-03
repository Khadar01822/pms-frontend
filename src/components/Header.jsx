import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">PMS Dashboard</h1>
      <nav className="flex gap-4">
        <Link
          to="/"
          className="hover:bg-gray-700 px-3 py-1 rounded transition"
        >
          Dashboard
        </Link>
        <Link
          to="/apartments"
          className="hover:bg-gray-700 px-3 py-1 rounded transition"
        >
          Apartments
        </Link>
        <Link
          to="/tenants"
          className="hover:bg-gray-700 px-3 py-1 rounded transition"
        >
          Tenants
        </Link>
        <Link
          to="/payments"
          className="hover:bg-gray-700 px-3 py-1 rounded transition"
        >
          Payments
        </Link>
        <Link
          to="/maintenance"
          className="hover:bg-gray-700 px-3 py-1 rounded transition"
        >
          Maintenance
        </Link>
      </nav>
    </header>
  );
}

export default Header;
