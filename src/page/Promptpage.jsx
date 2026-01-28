import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PromptBox from "../components/PromptBox";
import ChoiceCard from "../components/ChoiceCard";
import categoriesData from "../utils/matchingPrompt.json";
import communicationWays from "../utils/communication.json";
import { api } from "../services/api";

const iconMap = {
  "Mental Health": "/choice-icon/impact/impact-mental-health.svg",
  "Imitate": "/choice-icon/impact/impact-Imitate.svg",
  "Impact on user": "/choice-icon/impact/impact-user.svg",
  "Property lost": "/choice-icon/impact/impact-bankrupt.svg",
  "Rights and Law Violation": "/choice-icon/impact/impact-legal-abuse.svg",
  "sexual content inappropriate": "/choice-icon/problem/problem-sexual.svg",
  "inappropriate language": "/choice-icon/problem/problem-language.svg",
  "violation and violence": "/choice-icon/problem/problem-abuse.svg",
  "believe violation": "/choice-icon/problem/problem-belief.svg",
  "cyber crime and fraud": "/choice-icon/problem/problem-pishing.svg",
  "online gambling": "/choice-icon/problem/problem-gambling.svg",
  "cyberbullying": "/choice-icon/problem/problem-cyberbullying.svg",
  "elder" : "/choice-icon/talk/talk-elder.svg",
  "friend" : "/choice-icon/talk/talk-friend.svg",
  "child" : "/choice-icon/talk/talk-child.svg",
  "creative" : "/choice-icon/talk/talk-creative.svg",
};

function PromptPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Content from PromptBox
  const [promptMode, setPromptMode] = useState("text");
  const [promptContent, setPromptContent] = useState(null);

  const [selectedItems, setSelectedItems] = useState({
    page1: [],
    impacts: [],
    communication: [],
    contacts: []
  });

  const handleModeChange = useCallback((mode) => {
    setPromptMode(mode);
  }, []);

  const handleContentChange = useCallback((content) => {
    setPromptContent(content);
  }, []);

  const toggleSelection = (section, value, maxSelect) => {
    setSelectedItems(prev => {
      const current = prev[section];

      if (current.includes(value)) {
        return { ...prev, [section]: current.filter(v => v !== value) };
      }

      if (maxSelect && current.length >= maxSelect) return prev;

      return { ...prev, [section]: [...current, value] };
    });
  };

  const page1Categories = categoriesData.categories;

  const selectedCategories = useMemo(() => {
    return categoriesData.categories.filter(cat =>
      selectedItems.page1.includes(cat.id)
    );
  }, [selectedItems.page1]);

  const page2Impacts = useMemo(() => {
    const map = new Map();

    selectedCategories.forEach(cat => {
      cat.impacts.forEach(impact => {
        map.set(impact.en, impact);
      });
    });

    return Array.from(map.values());
  }, [selectedCategories]);

  // Get labels for selected items
  const getSelectedLabels = () => {
    const problemLabels = selectedCategories.map(cat => cat.title_th).join(", ");
    const impactLabels = selectedItems.impacts
      .map(impactEn => {
        const impact = page2Impacts.find(i => i.en === impactEn);
        return impact?.th || impactEn;
      })
      .join(", ");
    const commOption = communicationWays.options.find(
      opt => opt.id === selectedItems.communication[0]
    );
    const communicationLabel = commOption?.th || "";

    return { problemLabels, impactLabels, communicationLabel };
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('backend_token');
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('backend_token');

    if (!token) {
      setError("กรุณาเข้าสู่ระบบก่อนใช้งาน");
      return;
    }

    // Validate content
    if (promptMode === "text" && (!promptContent || promptContent.trim() === "")) {
      setError("กรุณากรอกเนื้อหาที่ต้องการวิเคราะห์");
      return;
    }
    if (promptMode === "link" && (!promptContent || promptContent.trim() === "")) {
      setError("กรุณากรอกลิงก์วิดีโอ");
      return;
    }
    if (promptMode === "image" && (!promptContent?.file)) {
      setError("กรุณาอัปโหลดรูปภาพ");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { problemLabels, impactLabels, communicationLabel } = getSelectedLabels();
      let result;

      if (promptMode === "text") {
        result = await api.generateAdviceText(token, {
          content: promptContent,
          problem: problemLabels,
          concerning: impactLabels,
          approach: communicationLabel,
          goal: communicationLabel
        });
      } else if (promptMode === "image") {
        // Upload image first, then send URL to API
        const imageUrl = await uploadImage(promptContent.file);
        result = await api.generateAdviceImage(token, imageUrl);
      } else if (promptMode === "link") {
        result = await api.generateAdviceLink(token, promptContent);
      }

      // Store result and navigate to result list page
      localStorage.setItem("promptData", JSON.stringify({
        mode: promptMode,
        problems: selectedItems.page1,
        impacts: selectedItems.impacts,
        communication: selectedItems.communication,
      }));

      // Navigate to result list page first
      navigate("/result");
    } catch (err) {
      console.error("LLM API Error:", err);
      setError(err.message || "เกิดข้อผิดพลาดในการวิเคราะห์ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-xl mx-auto space-y-6">

        <PromptBox
          readOnly={currentPage === 2}
          onModeChange={handleModeChange}
          onContentChange={handleContentChange}
        />

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
            <span className="text-sm">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900"
            >
              &times;
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-cyan-500">
            {currentPage === 1
              ? "เลือกประเภทเนื้อหา"
              : "เลือกผลกระทบและวิธีการสื่อสาร"}
          </h1>
          <p className="text-sm text-gray-500">
            ขั้นตอนที่ {currentPage} จาก 2
          </p>
        </div>

        {/* ================= PAGE 1 ================= */}
        {currentPage === 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fadeIn">
            {page1Categories.map(category => (
              <ChoiceCard
                key={category.id}
                title={category.title_th}
                iconSource={iconMap[category.title_en] || iconMap.default}
                selected={selectedItems.page1.includes(category.id)}
                onClick={() =>
                  toggleSelection("page1", category.id, 1)
                }
              />
            ))}

            <div className="col-span-full flex justify-center mt-6">
              <button
                disabled={selectedItems.page1.length === 0}
                onClick={() => setCurrentPage(2)}
                className="btn-normal-active disabled:bg-gray-300"
              >
                ไปต่อ
              </button>
            </div>
          </div>
        )}

        {/* ================= PAGE 2 ================= */}
        {currentPage === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <section>
              <h2 className="text-base font-semibold text-primary mb-4">
                ผลกระทบที่อาจเกิดขึ้น
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {page2Impacts.map(impact => (
                  <ChoiceCard
                    key={impact.en}
                    title={impact.th}
                    iconSource={iconMap[impact.en] || iconMap.default}
                    selected={selectedItems.impacts.includes(impact.en)}
                    onClick={() =>
                      toggleSelection("impacts", impact.en, 3)
                    }
                  />
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold text-primary mb-4">
                  เป้าหมายในการใช้งาน
              </h2>

              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <ChoiceCard
                    title={communicationWays.options[0].th}
                    iconSource={
                      iconMap[communicationWays.options[0].id] || iconMap.default
                    }
                    selected={selectedItems.communication.includes(
                      communicationWays.options[0].id
                    )}
                    onClick={() =>
                      toggleSelection(
                        "communication",
                        communicationWays.options[0].id,
                        1,
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {communicationWays.options.slice(1).map(option => (
                    <ChoiceCard
                      key={option.id}
                      title={option.th}
                      iconSource={iconMap[option.id] || iconMap.default}
                      selected={selectedItems.communication.includes(option.id)}
                      onClick={() =>
                        toggleSelection(
                          "communication",
                          option.id,
                          1
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            </section>
            <div className="flex justify-center gap-2 items-center">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={isLoading}
                className="btn-normal-inactive sm:min-w-[280px] disabled:opacity-50"
              >
                ย้อนกลับ
              </button>

              <button
                onClick={handleSubmit}
                disabled={isLoading || selectedItems.communication.length === 0}
                className="btn-normal-active sm:min-w-[280px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    กำลังวิเคราะห์...
                  </span>
                ) : (
                  "วิเคราะห์เนื้อหา"
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-gray-700">กำลังวิเคราะห์เนื้อหา...</p>
            <p className="text-sm text-gray-500">อาจใช้เวลาสักครู่</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default PromptPage;
