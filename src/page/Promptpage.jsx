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
  const [rateLimitReached, setRateLimitReached] = useState(false);

  // Content from PromptBox
  const [promptMode, setPromptMode] = useState("text");
  const [promptContent, setPromptContent] = useState(null);
  const [isContentValid, setIsContentValid] = useState(false);
  const [promptDescription, setPromptDescription] = useState("");

  const [selectedItems, setSelectedItems] = useState({
    page1: [],
    impacts: [],
    communication: [],
    contacts: []
  });

  const handleModeChange = useCallback((mode) => {
    setPromptMode(mode);
  }, []);

  const handleContentChange = useCallback((content, description) => {
    setPromptContent(content);
    setPromptDescription(description || "");
  }, []);

  const handleValidationChange = useCallback((isValid) => {
    setIsContentValid(isValid);
  }, []);

  const toggleSelection = (section, value, maxSelect) => {
    setSelectedItems(prev => {
      const current = prev[section];

      if (current.includes(value)) {
        return { ...prev, [section]: current.filter(v => v !== value) };
      }

      // If maxSelect is 1, replace the current selection instead of blocking
      if (maxSelect === 1) {
        return { ...prev, [section]: [value] };
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
    
    // Map frontend communication labels to backend goal format
    const GOAL_MAPPING = {
      'ตอบกลับคอมเมนต์': 'ตอบกลับคอมเมนต์',
      'ชวนคิด ชวนคุยกับลูก / เด็กๆ': 'ตั้งคำถามชวนคุยกับลูก',
      'ชวนคิด ชวนคุยกับเพื่อน': 'ตั้งคำถามชวนคุยกับเพื่อน',
      'ชวนคิด ชวนคุยกับคนอายุมากกว่า': 'ตั้งคำถามชวนคุยกับคนที่อายุมากกว่า'
    };
    
    const goalForBackend = GOAL_MAPPING[communicationLabel] || communicationLabel;
    
    let result;

    if (promptMode === "text") {
      result = await api.generateAdviceText(token, {
        content: promptContent,
        contentDescription: promptDescription, // ← ADD THIS
        problem: problemLabels,
        concerning: impactLabels,
        approach: communicationLabel,
        goal: goalForBackend
      });
    } else if (promptMode === "image") {
      // Upload image first, then send URL to API
      const imageUrl = await uploadImage(promptContent.file);
      result = await api.generateAdviceImage(token, imageUrl, promptDescription); // ← ADD THIS
    } else if (promptMode === "link") {
      result = await api.generateAdviceLink(token, promptContent, promptDescription); // ← ADD THIS
    }

    // Store result and navigate directly to result view page
    localStorage.setItem("promptData", JSON.stringify({
      mode: promptMode,
      problems: selectedItems.page1,
      impacts: selectedItems.impacts,
      communication: selectedItems.communication,
    }));

    // Navigate directly to the result view page with the result ID
    const resultId = result._id || result.id || result.promptId;
    if (resultId) {
      navigate(`/result/${resultId}`);
    } else {
      // Fallback: navigate to agentic page if no ID
      console.error("No result ID returned from API");
      navigate("/agentic");
    }
  } catch (err) {
    console.error("LLM API Error:", err);

    // Check for rate limit error (429 status or specific messages)
    const errorMessage = err.message?.toLowerCase() || '';
    const isRateLimit =
      err.status === 429 ||
      errorMessage.includes('rate limit') ||
      errorMessage.includes('limit reached') ||
      errorMessage.includes('daily limit') ||
      errorMessage.includes('too many requests') ||
      errorMessage.includes('exceeded');

    if (isRateLimit) {
      setRateLimitReached(true);
      setError(null);
    } else {
      setError(err.message || "เกิดข้อผิดพลาดในการวิเคราะห์ กรุณาลองใหม่อีกครั้ง");
    }
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
          onValidationChange={handleValidationChange}
        />

        {/* Rate Limit Alert */}
        {rateLimitReached && (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-800">
                  ถึงขีดจำกัดการใช้งานวันนี้แล้ว
                </h3>
                <p className="text-sm text-amber-700 mt-1">
                  คุณสามารถใช้งานได้ 3 ครั้งต่อวัน กรุณากลับมาใหม่ในวันพรุ่งนี้
                </p>
                <p className="text-xs text-amber-600 mt-2">
                  ขีดจำกัดจะรีเซ็ตเวลาเที่ยงคืน
                </p>
              </div>
              <button
                onClick={() => setRateLimitReached(false)}
                className="text-amber-500 hover:text-amber-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

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
          
          <h1 className="text-xl font-bold text-primary">
            {currentPage === 1 ? (
              <>
                ปัญหาที่พบ
                <span className="ml-2 text-xs font-medium text-gray-400">
                  (กดเลือกเพียง 1 เป้าหมายที่ท่านต้องการ)
                </span>
              </>
            ) : (
              <>
                ความกังวลที่พบ
                <span className="ml-2 text-xs text-gray-400">
                </span>
              </>
            )}
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
                disabled={selectedItems.page1.length === 0 || !isContentValid}
                onClick={() => setCurrentPage(2)}
                className="btn-normal-active disabled:bg-gray-300"
              >
                ไปต่อ
              </button>
            </div>
          </div>
        )}

        {/* ================= PAGE 2 ================= */}
{/* ================= PAGE 2 ================= */}
{currentPage === 2 && (
  <div className="space-y-8 animate-fadeIn">
    <section>
      <div className="flex gap-2 items-center">
        <h2 className="text-base font-semibold text-primary mb-4">
          ผลกระทบที่อาจเกิดขึ้น
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          (กดเลือกเพียง 1 ความกังวลที่ท่านเจอ)
        </p>
       </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {page2Impacts.map(impact => (
          <ChoiceCard
            key={impact.en}
            title={impact.th}
            iconSource={iconMap[impact.en] || iconMap.default}
            selected={selectedItems.impacts.includes(impact.en)}
            onClick={() =>
              toggleSelection("impacts", impact.en, 1)
            }
          />
        ))}
      </div>
    </section>
    
    <section>
      <div className="flex gap-2 items-center">
        <h2 className="text-base font-semibold text-primary mb-4">
          เป้าหมายการใช้งาน
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          (กดเลือกเพียง 1 เป้าหมายที่ท่านต้องการ)
        </p>
       </div>

      <div className="space-y-3">
        {/* Get available goals based on selected categories */}
        {(() => {
          const availableGoals = new Map();
          
          // Collect all unique goals from selected categories
          selectedCategories.forEach(cat => {
            if (cat.goal && Array.isArray(cat.goal)) {
              cat.goal.forEach(g => {
                if (!availableGoals.has(g.th)) {
                  availableGoals.set(g.th, g);
                }
              });
            }
          });
          
          const goalsArray = Array.from(availableGoals.values());
          
          // Find "ตอบกลับคอมเมนต์" option
          const replyOption = goalsArray.find(g => g.th === "ตอบกลับคอมเมนต์");
          const otherOptions = goalsArray.filter(g => g.th !== "ตอบกลับคอมเมนต์");
          
          return (
            <>
              {/* First row - "ตอบกลับคอมเมนต์" */}
              {replyOption && (
                <div className="grid grid-cols-1 gap-3">
                  <ChoiceCard
                    title={replyOption.th}
                    iconSource={iconMap["creative"] || iconMap.default}
                    selected={selectedItems.communication.includes("creative")}
                    onClick={() =>
                      toggleSelection("communication", "creative", 1)
                    }
                  />
                </div>
              )}

{/* Second row - Other options */}
{otherOptions.length > 0 && (
  <div className={`grid gap-3 ${otherOptions.length === 2 ? 'grid-cols-2' : otherOptions.length === 1 ? 'grid-cols-1' : 'grid-cols-3'}`}>
    {otherOptions.map((goal, index) => {
      // Map goal text to icon ID
      let iconId = "friend"; // default
      if (goal.th.includes("ลูก") || goal.th.includes("เด็ก")) {
        iconId = "child";
      } else if (goal.th.includes("เพื่อน")) {
        iconId = "friend";
      } else if (goal.th.includes("อายุมากกว่า")) {
        iconId = "elder";
      }
      
      return (
        <ChoiceCard
          key={`${goal.th}-${index}`}
          title={goal.th}
          iconSource={iconMap[iconId] || iconMap.default}
          selected={selectedItems.communication.includes(iconId)}
          onClick={() =>
            toggleSelection("communication", iconId, 1)
          }
        />
      );
    })}
  </div>
)}
            </>
          );
        })()}
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
        disabled={isLoading || selectedItems.communication.length === 0 || rateLimitReached}
        className="btn-normal-active sm:min-w-[280px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            กำลังวิเคราะห์...
          </span>
        ) : rateLimitReached ? (
          "ถึงขีดจำกัดวันนี้แล้ว"
        ) : (
          "วิเคราะห์เนื้อหา"
        )}
      </button>
    </div>
  </div>
)}
      </div>

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
