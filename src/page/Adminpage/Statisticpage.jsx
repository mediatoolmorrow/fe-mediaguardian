import React, { useState, useEffect } from "react";
import { api } from "../../services/api";

export default function Statisticspage() {
  const [stepData, setStepData] = useState(null);
  const [refData, setRefData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('backend_token');
    if (!token) return;
    Promise.all([
      api.getStepSummary(token),
      api.getRefSummary(token),
    ])
      .then(([step, ref]) => {
        if (step.success) setStepData(step);
        if (ref.success) setRefData(ref);
      })
      .catch(err => setError(err.message || 'โหลดข้อมูลไม่สำเร็จ'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Step Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">ความคืบหน้าของผู้ใช้งาน</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            จำนวน user ที่คงอยู่ในแต่ละหน้าล่าสุด (ทั้งหมด {stepData?.total ?? 0} คน)
          </p>
        </div>
        <div className="space-y-4">
          {stepData?.data?.map(({ step, label, count }) => {
            const total = stepData.total || 1;
            const pct = Math.round((count / total) * 100);
            return (
              <div key={step}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mr-2">
                      {step}
                    </span>
                    {label}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">{count} คน</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ref Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">ที่มาของผู้ใช้งาน</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            จำนวน user แยกตามแหล่งที่มา (ทั้งหมด {refData?.total ?? 0} คน)
          </p>
        </div>
        <div className="space-y-4">
          {refData?.data?.map(({ ref, count }) => {
            const total = refData.total || 1;
            const pct = Math.round((count / total) * 100);
            return (
              <div key={ref}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 font-mono">{ref}</span>
                  <span className="text-sm font-semibold text-gray-800">{count} คน ({pct}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
