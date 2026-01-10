import React from "react";

export default function ChartPlaceholder({ title, height = 'h-64' }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className={`${height} bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300`}>
        <div className="text-center text-gray-500">
          <BarChart3 size={48} className="mx-auto mb-2 opacity-50" />
          <p className="font-medium">MongoDB Chart Integration</p>
          <p className="text-sm">Insert your chart embed code here</p>
        </div>
      </div>
    </div>
  );
}