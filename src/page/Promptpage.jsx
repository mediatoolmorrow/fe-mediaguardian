import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PromptBox from "../components/PromptBox";
import ChoiceCard from "../components/ChoiceCard";
import categoriesData from "../utils/matchingPrompt.json";
import communicationWays from "../utils/communication.json";

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

   const [selectedItems, setSelectedItems] = useState({
    page1: [],          
    impacts: [],         
    communication: [],
    contacts: []
  });

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-xl mx-auto space-y-6">

        <PromptBox />

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
                แนวทางการสื่อสาร
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
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setCurrentPage(1)}
                className="btn-normal"
              >
                ย้อนกลับ
              </button>

              <button
                onClick={() =>
                  navigate("/contact", {
                    state: {
                        problemIds: selectedItems.page1
                      }
                  })
                }
                className="btn-normal-active"
              >
                ไปต่อ
              </button>
            </div>
          </div>
        )}

        {/* ================= SUMMARY ================= */}
        {(selectedItems.page1.length > 0 ||
          selectedItems.impacts.length > 0 ||
          selectedItems.communication.length > 0) && (
          <div className="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
            <p className="text-sm font-semibold text-cyan-800 mb-2">
              สรุปรายการที่เลือก
            </p>
            <p className="text-xs text-cyan-700 space-y-1">
              <span>• ประเภทเนื้อหา: {selectedItems.page1.length} รายการ</span><br />
              <span>• ผลกระทบ: {selectedItems.impacts.length} รายการ</span><br />
              <span>• วิธีการสื่อสาร: {selectedItems.communication.length} รายการ</span>
            </p>
          </div>
        )}

      </div>

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
