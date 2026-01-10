import React from "react";

export default function Sidebar({ isOpen, currentPage, onPageChange, onLogout }) {
  return (
    <div className={`${isOpen ? 'w-64' : 'w-0'} bg-gray-900 text-white transition-all duration-300 overflow-hidden relative`}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
        <nav className="space-y-2">
          <button
            onClick={() => onPageChange('stats')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              currentPage === 'stats' ? 'bg-blue-600' : 'hover:bg-gray-800'
            }`}
          >
            <span>Statistics</span>
          </button>
          <button
            onClick={() => onPageChange('tutorial')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              currentPage === 'tutorial' ? 'bg-blue-600' : 'hover:bg-gray-800'
            }`}
          >
            <span>Tutorial Video</span>
          </button>
        </nav>
        {/** 
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-600 transition-colors absolute bottom-6 left-6 right-6"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
        */}
      </div>
    </div>
  );
}