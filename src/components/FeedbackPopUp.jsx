import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

function FeedbackPopUp({ isOpen, onClose, onContinue }) {
  const { backendUser, isAdmin } = useAuth();

  // State for 3 options, each with rating and explanation
  const [ratings, setRatings] = useState({
    option1: null,
    option2: null,
    option3: null,
  });
  const [explanations, setExplanations] = useState({
    option1: "",
    option2: "",
    option3: "",
  });

  const isAdminOrResearcher = isAdmin || backendUser?.role === "researcher";

  const handleRatingChange = (optionKey, value) => {
    setRatings((prev) => ({
      ...prev,
      [optionKey]: value,
    }));
  };

  const handleExplanationChange = (optionKey, value) => {
    setExplanations((prev) => ({
      ...prev,
      [optionKey]: value,
    }));
  };

  const canContinue = () => {
    // All 3 options must be rated
    if (!ratings.option1 || !ratings.option2 || !ratings.option3) return false;

    // For admin/researcher, all explanations are required
    if (isAdminOrResearcher) {
      if (!explanations.option1.trim() || !explanations.option2.trim() || !explanations.option3.trim()) {
        return false;
      }
    }
    return true;
  };

  const handleContinue = () => {
    if (!canContinue()) return;

    onContinue?.({
      ratings,
      explanations: isAdminOrResearcher ? explanations : null,
    });

    // Reset state
    setRatings({ option1: null, option2: null, option3: null });
    setExplanations({ option1: "", option2: "", option3: "" });
  };

  const handleClose = () => {
    setRatings({ option1: null, option2: null, option3: null });
    setExplanations({ option1: "", option2: "", option3: "" });
    onClose?.();
  };

  if (!isOpen) return null;

  const optionLabels = [
    { key: "option1", label: "ตัวเลือกที่ 1" },
    { key: "option2", label: "ตัวเลือกที่ 2" },
    { key: "option3", label: "ตัวเลือกที่ 3" },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="relative bg-white rounded-xl p-6 sm:p-8 w-full max-w-[500px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-primary text-center mb-6">
          คุณคิดอย่างไรกับผลลัพธ์นี้?
        </h2>

        <div className="flex flex-col gap-4 mb-6">
          {optionLabels.map(({ key, label }) => (
            <div
              key={key}
              className="border border-gray-200 rounded-xl p-4 bg-gray-50"
            >
              <p className="font-medium text-gray-700 mb-3">{label}</p>

              {/* Rating buttons */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => handleRatingChange(key, "like")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border-2 transition-all text-sm ${
                    ratings[key] === "like"
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 hover:border-primary/50 bg-white"
                  }`}
                >
                  <span>👍</span>
                  <span>ชอบ</span>
                </button>

                <button
                  onClick={() => handleRatingChange(key, "improve")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border-2 transition-all text-sm ${
                    ratings[key] === "improve"
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-gray-200 hover:border-yellow-300 bg-white"
                  }`}
                >
                  <span>👎</span>
                  <span>อยากให้ปรับปรุง</span>
                </button>
              </div>

              {/* Explanation box - only for admin/researcher */}
              {isAdminOrResearcher && (
                <>
                  <textarea
                    value={explanations[key]}
                    onChange={(e) => handleExplanationChange(key, e.target.value)}
                    placeholder="อธิบายเพิ่มเติม (จำเป็น)..."
                    className="w-full h-16 p-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                  {ratings[key] && !explanations[key].trim() && (
                    <p className="text-red-500 text-xs mt-1">กรุณากรอกคำอธิบาย</p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            text="ไปต่อ"
            variant={canContinue() ? "normalActive" : "normalInactive"}
            onClick={handleContinue}
            disabled={!canContinue()}
          />
        </div>
      </div>
    </div>
  );
}

export default FeedbackPopUp;
