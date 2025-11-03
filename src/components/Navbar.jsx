import React from "react";
import { Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navbar = ({ setSidebarOpen }) => {
  return (
    <header className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 shadow-md">
      {/* Mobile sidebar toggle button */}
      <button
        className="md:hidden text-gray-700 dark:text-gray-200"
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
        <Menu size={24} />
      </button>

      {/* Dashboard Title */}
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        PMS Dashboard
      </h1>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <img
          src="https://i.pravatar.cc/40"
          alt="User"
          className="w-8 h-8 rounded-full border"
        />
      </div>
    </header>
  );
};

export default Navbar;
