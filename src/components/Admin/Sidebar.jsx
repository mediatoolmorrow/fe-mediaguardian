import React from "react";
import { BarChart3, Video, ClipboardList, MessageSquare, Users, Shield } from "lucide-react";

export default function Sidebar({ isOpen, currentPage, onPageChange, onLogout, isSuperAdmin }) {
  return (
    <div className={`${isOpen ? 'w-64' : 'w-0'} bg-gray-900 text-white transition-all duration-300 overflow-hidden relative`}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
        <nav className="space-y-2">
          <button
            onClick={() => onPageChange('survey')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              currentPage === 'survey' ? 'bg-blue-600' : 'hover:bg-gray-800'
            }`}
          >
            <ClipboardList size={20} />
            <span>Survey Analytics</span>
          </button>
          <button
            onClick={() => onPageChange('prompts')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              currentPage === 'prompts' ? 'bg-blue-600' : 'hover:bg-gray-800'
            }`}
          >
            <MessageSquare size={20} />
            <span>Prompt Analytics</span>
          </button>

          {isSuperAdmin && (
            <>
              <div className="border-t border-gray-700 my-4"></div>
              <p className="text-xs text-gray-500 uppercase tracking-wider px-3 mb-2">Super Admin</p>
              <button
                onClick={() => onPageChange('admin-management')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  currentPage === 'admin-management' ? 'bg-purple-600' : 'hover:bg-gray-800'
                }`}
              >
                <Shield size={20} />
                <span>Admin Management</span>
              </button>
              <button
                onClick={() => onPageChange('user-list')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  currentPage === 'user-list' ? 'bg-purple-600' : 'hover:bg-gray-800'
                }`}
              >
                <Users size={20} />
                <span>User List</span>
              </button>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}