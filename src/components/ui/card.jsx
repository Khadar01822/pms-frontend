// src/components/ui/card.jsx
import React from "react";
import clsx from "clsx";

export const Card = ({ className, children, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ className, children }) => {
  return <div className={clsx("p-4", className)}>{children}</div>;
};
