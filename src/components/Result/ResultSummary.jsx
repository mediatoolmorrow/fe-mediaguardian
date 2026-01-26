import React from "react";
import { useNavigate } from "react-router-dom";

export default function ResultSummary({ id, description, mode, createdAt, inputPreview }) {
  const navigate = useNavigate();

  // Truncate description for preview (shorter for list view)
  const truncatedDescription = description && description.length > 150
    ? description.substring(0, 150) + "..."
    : description;

  // Format date safely
  const formatDate = (dateValue) => {
    if (!dateValue) return null;
    try {
      const date = new Date(dateValue);
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

  // Mode label and icon
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
    <div
      onClick={handleClick}
      className="w-full max-w-[648px] flex flex-row items-start gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
    >
      <img
        src="/icon/result.svg"
        className="w-10 h-10 flex-shrink-0"
        alt="Result"
      />

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {mode && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                <img src={modeInfo.icon} alt="" className="w-3 h-3" />
                {modeInfo.label}
              </span>
            )}
          </div>
          {formattedDate && (
            <span className="text-xs text-gray-400">{formattedDate}</span>
          )}
        </div>

        {/* Input preview if available */}
        {inputPreview && (
          <p className="text-xs text-gray-500 mb-2 truncate">
            <span className="font-medium">เนื้อหา:</span> {inputPreview}
          </p>
        )}

        {/* LLM Response preview */}
        <p className="text-xs text-text break-words line-clamp-3">
          {truncatedDescription || "ไม่มีเนื้อหา"}
        </p>

        <div className="flex justify-end mt-3">
          <span className="text-xs text-primary font-medium flex items-center gap-1">
            ดูรายละเอียด
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
