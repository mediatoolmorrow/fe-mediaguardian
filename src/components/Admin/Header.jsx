import React from "react";

export default function Header({ sidebarOpen, onToggleSidebar, pageTitle }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {sidebarOpen ?  "X" : "Menu"} 
        </button>
        <h2 className="text-xl font-semibold text-gray-800">{pageTitle}</h2>
        <div className="w-10"></div>
      </div>
    </header>
  );
}