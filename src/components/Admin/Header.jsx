import React from "react";
import { Menu, X, LogOut, ArrowLeft } from "lucide-react";

export default function Header({ sidebarOpen, onToggleSidebar, pageTitle, adminUser, onLogout, onBackToApp }) {
  const getRoleBadge = () => {
    if (!adminUser) return null;

    if (adminUser.isSuperAdmin || adminUser.role === 'superadmin') {
      return (
        <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
          Super Admin
        </span>
      );
    }
    if (adminUser.isAdmin || adminUser.role === 'admin') {
      return (
        <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          Admin
        </span>
      );
    }
    return null;
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h2 className="text-xl font-semibold text-gray-800">{pageTitle}</h2>
        <div className="flex items-center space-x-4">
          {adminUser && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 hidden sm:inline">
                {adminUser.username || adminUser.email}
              </span>
              {getRoleBadge()}
            </div>
          )}
          {onBackToApp && (
            <button
              onClick={onBackToApp}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Back to App"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}