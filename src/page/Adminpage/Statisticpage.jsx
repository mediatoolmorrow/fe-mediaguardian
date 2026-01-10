import React from "react";

export default function Statisticspage({ stats, loading }) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      </div>
    </div>
  );
}