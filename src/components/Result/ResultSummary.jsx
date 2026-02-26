import React from "react";
import { useNavigate } from "react-router-dom";

export default function ResultSummary({ id, description, mode, createdAt, inputPreview, resultNumber, isLatest }) {
  const navigate = useNavigate();

  // Truncate description for preview (shorter for list view)
  const trimmedDescription = description?.trim() || "";
  const truncatedDescription = trimmedDescription.length > 150
    ? trimmedDescription.substring(0, 150) + "..."
    : trimmedDescription;

  // Format date safely (handles Firestore Timestamp)
  const formatDate = (dateValue) => {
    if (!dateValue) return null;
    try {
      let date;

      // Handle Firestore Timestamp with _seconds
      if (dateValue._seconds !== undefined) {
        date = new Date(dateValue._seconds * 1000);
      }
      // Handle Firestore Timestamp with seconds
      else if (dateValue.seconds !== undefined) {
        date = new Date(dateValue.seconds * 1000);
      }
      // Handle regular date string or timestamp
      else {
        date = new Date(dateValue);
      }

      if (isNaN(date.getTime())) return null;
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return null;
    }
  };

  const formattedDate = formatDate(createdAt);

  const getModeInfo = () => {
    switch (mode) {
      case 'text':
        return { label: 'ข้อความ', icon: '/icon/message.svg' };
      case 'image':
        return { label: 'รูปภาพ', icon: '/icon/image.svg' };
      case 'link':
        return { label: 'ลิงก์', icon: '/icon/link.svg' };
      default:
        return { label: mode, icon: '/icon/message.svg' };
    }
  };

  const modeInfo = getModeInfo();

  const handleClick = () => {
    navigate(`/result/${id}`);
  };

  return (
    <div className="w-full max-w-[648px] flex flex-col gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all">
      <div className="flex flex-row items-start gap-3">
        <img
          src="/icon/result.svg"
          className="w-10 h-10 flex-shrink-0"
          alt="Result"
        />
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">แนวทางการสื่อสาร {resultNumber}</span>
              {isLatest && (
                <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                  ใหม่
                </span>
              )}
            </div>
            {formattedDate && (
              <span className="text-xs text-gray-400">{formattedDate}</span>
            )}
          </div>
          {inputPreview && (
            <p className="text-xs text-gray-500 mb-2 truncate">
              <span className="font-medium">เนื้อหา:</span> {inputPreview}
            </p>
          )}
          <p className="text-xs text-text break-words line-clamp-3">
            {truncatedDescription || "ไม่มีเนื้อหา"}
          </p>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={handleClick}
          className="btn-normal-active"
        >
          เลือกแนวนี้
        </button>
      </div>
    </div>
  );
}