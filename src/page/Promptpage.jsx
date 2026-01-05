import React, {useState} from "react";
import PromptBox from "../components/PromptBox";
import Button from "../components/Button";
import ChoiceCard from "../components/ChoiceCard";

const iconMap = {
  "การถูกหลอกโดยข่าวปลอม": "src/assets/choice-icon/problem/fake-news.svg",
  "ไม่มั่นใจในข้อมูล": "src/assets/choice-icon/problem/confusion.svg",
  "ข้อมูลบิดเบือน": "src/assets/choice-icon/problem/dis-info.svg",
  "สินค้าไม่ตรงปก": "src/assets/choice-icon/problem/fake-merch.svg",
  "หลอกให้รักออนไลน์": "src/assets/choice-icon/problem/fake-love.svg",
  "โฆษณาเกินจริง": "src/assets/choice-icon/problem/fake-promo.svg",
  "หลอกให้ลงทุน": "src/assets/choice-icon/problem/fake-inves.svg",
  
  "ขโมยข้อมูลส่วนตัว": "src/assets/choice-icon/problem/phising.svg",
  "ใช้ภาพบุคคลโดยไม่ได้รับอนุญาต": "src/assets/choice-icon/problem/privacy.svg",
  "ละเมิดสิทธิเด็กและเยาวชน": "src/assets/choice-icon/problem/child-abuse.svg",
  
  "ต่อสุขภาพกาย": "src/assets/choice-icon/problem/health-risk.svg",
  "ต่อสุขภาพจิต": "src/assets/choice-icon/problem/mentalhealth-risk.svg",
  "ต่อสังคม": "src/assets/choice-icon/problem/social-risk.svg",
  
  "การถูกคุกคาม": "src/assets/choice-icon/problem/abuse.svg",
  "การลามกอนาจาร": "src/assets/choice-icon/problem/pervert.svg",
  
  "การตกเป็นเหยื่อ": "src/assets/choice-icon/worry/victimize.svg",
  "การเสียทรัพสิน": "src/assets/choice-icon/worry/money.svg",
  "เรื่องสุขภาพจิต": "src/assets/choice-icon/worry/mental-health.svg",
  "เกิดอันตราย": "src/assets/choice-icon/worry/danger.svg",
  
  "ตอบกลับอย่างสร้างสรรค์": "src/assets/choice-icon/worry/creative-commu.svg",
  "ตั้งคำถามเชิญชวน": "src/assets/choice-icon/worry/question.svg",
  "คุยกับลูก": "src/assets/choice-icon/worry/talk-child.svg",
  "คุยกับเพื่อน": "src/assets/choice-icon/worry/talk-friend.svg",
  "คุยกับคนอายุมากกว่า": "src/assets/choice-icon/worry/talk-elder.svg"
};

const questions = {
  page1: {
    section: "หัวข้อปัญหาที่พบ",
    groups: [
      {
        groupTitle: "ปัญหาการหลอกลวงและข้อมูล",
        options: [
          "การถูกหลอกโดยข่าวปลอม",
          "ไม่มั่นใจในข้อมูล",
          "ข้อมูลบิดเบือน",
          "สินค้าไม่ตรงปก",
          "หลอกให้รักออนไลน์",
          "โฆษณาเกินจริง",
          "หลอกให้ลงทุน"
        ],
        maxSelect: 3
      },
      {
        groupTitle: "ปัญหาการละเมิดสิทธิ",
        options: [
          "ขโมยข้อมูลส่วนตัว",
          "ใช้ภาพบุคคลโดยไม่ได้รับอนุญาต",
          "ละเมิดสิทธิเด็กและเยาวชน"
        ]
      },
      {
        groupTitle: "ปัญหาเนื้อหาอันตราย",
        options: [
          "ต่อสุขภาพกาย",
          "ต่อสุขภาพจิต",
          "ต่อสังคม"
        ]
      },
      {
        groupTitle: "ปัญหาความรุนแรงทางเพศ",
        options: [
          "การถูกคุกคาม",
          "การลามกอนาจาร"
        ]
      }
    ]
  },
  page2: {
    section: "หัวข้อความกังวล",
    groups: [
      {
        groupTitle: "ความกังวลที่เกิดขึ้น",
        options: [
          "การตกเป็นเหยื่อ",
          "การเสียทรัพสิน",
          "เรื่องสุขภาพจิต",
          "เกิดอันตราย"
        ]
      },
      {
        groupTitle: "เป้าหมายการใช้งาน",
        options: [
          "ตอบกลับอย่างสร้างสรรค์",
          "ตั้งคำถามเชิญชวน",
          "คุยกับลูก",
          "คุยกับเพื่อน",
          "คุยกับคนอายุมากกว่า"
        ]
      }
    ]
  }
};

function PromptPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState({
    page1: [],
    page2: []
  });

  const toggleSelection = (section, title, maxSelect) => {
    setSelectedItems(prev => {
      const currentSelected = prev[section];
      const isSelected = currentSelected.includes(title);
      
      if (isSelected) {
        return {
          ...prev,
          [section]: currentSelected.filter(item => item !== title)
        };
      }
      
      if (maxSelect && currentSelected.length >= maxSelect) {
        return prev; 
      }
      
      return {
        ...prev,
        [section]: [...currentSelected, title]
      };
    });
  };

  const nextPage = () => setCurrentPage(2);
  const prevPage = () => setCurrentPage(1);

  const renderOptions = (group, section) => {
    const { options, groupTitle, maxSelect } = group;
    const currentSelected = selectedItems[section];
    const isMaxReached = maxSelect && currentSelected.length >= maxSelect;

    if (groupTitle === "เป้าหมายการใช้งาน") {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            {options.slice(0, 2).map((option, index) => (
              <ChoiceCard
                key={index}
                title={option}
                iconSource={iconMap[option] || "/icons/default.svg"}
                selected={currentSelected.includes(option)}
                onClick={() => toggleSelection(section, option, maxSelect)}
                disabled={isMaxReached && !currentSelected.includes(option)}
              />
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {options.slice(2, 5).map((option, index) => (
              <ChoiceCard
                key={index + 2}
                title={option}
                iconSource={iconMap[option] || "/icons/default.svg"}
                selected={currentSelected.includes(option)}
                onClick={() => toggleSelection(section, option, maxSelect)}
                disabled={isMaxReached && !currentSelected.includes(option)}
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {options.map((option, index) => (
          <ChoiceCard
            key={index}
            title={option}
            iconSource={iconMap[option] || "/icons/default.svg"}
            selected={currentSelected.includes(option)}
            onClick={() => toggleSelection(section, option, maxSelect)}
            disabled={isMaxReached && !currentSelected.includes(option)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-xl mx-auto space-y-4">
        <PromptBox />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-cyan-500">
            {currentPage === 1 ? questions.page1.section : questions.page2.section}
          </h1>
          <p className="text-sm text-gray-500">
            ขั้นตอนที่ {currentPage} ใน 2
          </p>
        </div>

        {currentPage === 1 && (
          <div className="space-y-8 animate-fadeIn">
            {questions.page1.groups.map((group, groupIndex) => (
              <section key={groupIndex}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-primary">
                    {group.groupTitle}
                  </h2>
                </div>
                
                {renderOptions(group, 'page1')}
                
                {group.maxSelect && selectedItems.page1.length >= group.maxSelect && (
                  <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                    <span>⚠️</span>
                    คุณเลือกครบจำนวนสูงสุดแล้ว (ยกเลิกบางรายการเพื่อเลือกใหม่)
                  </p>
                )}
              </section>
            ))}

          <div className="sticky bottom-6 left-0 z-50 flex justify-center">
            <button
                onClick={nextPage}
                disabled={selectedItems.page1.length === 0}
                className="btn-normal-active flex items-center gap-2 shadow-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                ยอมรับ
            </button>
            </div>
          </div>
        )}

        {currentPage === 2 && (
          <div className="space-y-8 animate-fadeIn">
            {questions.page2.groups.map((group, groupIndex) => (
              <section key={groupIndex}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-primary">
                    {group.groupTitle}
                  </h2>
                  {group.maxSelect && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      เลือกแล้ว {selectedItems.page2.length}/{group.maxSelect}
                    </span>
                  )}
                </div>
                
                {renderOptions(group, 'page2')}
                
                {group.maxSelect && selectedItems.page2.length >= group.maxSelect && (
                  <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                    <span>⚠️</span>
                    คุณเลือกครบจำนวนสูงสุดแล้ว (ยกเลิกบางรายการเพื่อเลือกใหม่)
                  </p>
                )}
              </section>
            ))}

            <div className="sticky bottom-6 left-0 z-50 flex justify-center">
            <button
                onClick={() => {
                  console.log('Selected:', selectedItems);
                  alert('ทดสอบการเก็บช้อยส์ \n\nหน้า 1: ' + selectedItems.page1.length + ' รายการ\nหน้า 2: ' + selectedItems.page2.length + ' รายการ');
                }}      
                className="btn-normal-active flex items-center gap-2 shadow-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                ยอมรับ
            </button>
            </div>
          </div>
        )}

        {(selectedItems.page1.length > 0 || selectedItems.page2.length > 0) && (
          <div className="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
            <p className="text-sm font-semibold text-cyan-800 mb-2">
              รายการที่เลือกทั้งหมด: {selectedItems.page1.length + selectedItems.page2.length} รายการ
            </p>
            <div className="text-xs text-cyan-700 space-y-1">
              {selectedItems.page1.length > 0 && (
                <p>• หน้า 1: {selectedItems.page1.join(', ')}</p>
              )}
              {selectedItems.page2.length > 0 && (
                <p>• หน้า 2: {selectedItems.page2.join(', ')}</p>
              )}
            </div>
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