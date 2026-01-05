import React, { useState } from "react";
import ChoiceCheck from "../components/Survey/ChoiceCheck";
import ChoiceSelect from "../components/Survey/ChoiceSelect";
import Banner from "../components/Banner";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const surveyTemplate = {
  pages: [
    {
      pageId: 1,
      questions: [
        {
          id: "q1",
          type: "rating",
          label: "คุณพึงพอใจมากแค่ไหน",
          options: ["น้อยที่สุด", "น้อย", "ปานกลาง", "มาก", "มากที่สุด"]
        },
        {
          id: "q2",
          type: "rating",
          label: "คุณอยากแนะนำให้ผู้อื่นหรือไม่",
          options: ["น้อยที่สุด", "น้อย", "ปานกลาง", "มาก", "มากที่สุด"]
        },
        {
          id: "q3",
          type: "select",
          label: "สิ่งที่คุณชอบมากที่สุด",
          options: ["การออกแบบ", "การใช้งาน", "ความเร็ว", "เนื้อหา"]
        }
      ]
    },
    {
      pageId: 2,
      questions: [
        {
          id: "q4",
          type: "select",
          label: "สิ่งที่ควรปรับปรุง",
          options: ["UI", "Performance", "Feature", "Support"]
        }
      ]
    }
  ]
};

function Surveypage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const currentPageData = surveyTemplate.pages[currentPage];
  const isLastPage = currentPage === surveyTemplate.pages.length - 1;

  const handleSelectAnswer = (questionId, optionIndex) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex
    });
  };

  const handleNext = () => {
    if (currentPage < surveyTemplate.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      console.log("Survey completed:", answers);
      navigate("/contact")
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Banner imgSource="/banner/example.svg" />
      
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 ">
        <div className="max-w-[395px] mx-auto space-y-6 sm:space-y-10">

          <div className="space-y-8 sm:space-y-12">
            {currentPageData.questions.map((question) => {
              const currentAnswer = answers[question.id];
              
              return (
                <div key={question.id} className="space-y-4 sm:space-y-6">
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-primary">
                    {question.label}
                  </h2>

                  {question.type === "rating" ? (
                    <div className="grid grid-cols-5 sm:grid-cols-5 justify-items-center">
                      {question.options.map((option, index) => (
                        <ChoiceCheck
                          key={index}
                          text={option}
                          isSelect={currentAnswer === index}
                          onClick={() => handleSelectAnswer(question.id, index)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 sm:gap-4">
                      {question.options.map((option, index) => (
                        <ChoiceSelect
                          key={index}
                          text={option}
                          isSelect={currentAnswer === index}
                          onClick={() => handleSelectAnswer(question.id, index)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

            <div className="sticky bottom-6 left-0 z-50 flex justify-center">
            <button className="btn-normal-active"
              onClick={handleNext}
            > ยอมรับ </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Surveypage;