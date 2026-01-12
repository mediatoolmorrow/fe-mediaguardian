import React, { useState, useEffect } from "react";
import ChoiceSelect from "../components/Survey/ChoiceSelect";
import ChoiceCheck from "../components/Survey/ChoiceCheck";
import ChoiceBox from "../components/Survey/ChoiceBox";
import Banner from "../components/Banner";
import { surveyTemplate } from "../utils/surveyTemplate";

const RATING_OPTIONS = [
  "ไม่เห็นด้วย",
  "ค่อนข้างไม่เห็นด้วย",
  "ไม่แน่ใจ",
  "ค่อนข้างเห็นด้วย",
  "เห็นด้วยมาก"
];

function Surveypage() {
  const [userState, setUserState] = useState({
    isFirstTime: true,
    isFirstFormSubmitted: false,
    isSecondFormSubmitted: false
  });

  const [currentFormSet, setCurrentFormSet] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    determineFormToShow();
  }, [userState]);

  const determineFormToShow = () => {
    if (!userState.isFirstFormSubmitted) {
      setCurrentFormSet(1);
    } else if (!userState.isSecondFormSubmitted) {
      setCurrentFormSet(2);
    } else {
      setCurrentFormSet(3);
    }
  };

  const currentSetData = surveyTemplate.Set.find(set => set.formSet === currentFormSet);

  const handleSelectAnswer = (questionId, optionIndex, maxAnswer) => {
    const currentAnswers = answers[questionId] || [];
    const max = parseInt(maxAnswer) || 1;

    if (max === 1) {
      setAnswers({
        ...answers,
        [questionId]: [optionIndex]
      });
    } else {
      if (currentAnswers.includes(optionIndex)) {
        setAnswers({
          ...answers,
          [questionId]: currentAnswers.filter(i => i !== optionIndex)
        });
      } else {
        if (currentAnswers.length < max) {
          setAnswers({
            ...answers,
            [questionId]: [...currentAnswers, optionIndex]
          });
        }
      }
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", { formSet: currentFormSet, answers });
    
    if (currentFormSet === 1) {
      setUserState({
        ...userState,
        isFirstTime: false,
        isFirstFormSubmitted: true
      });
      alert("ส่งแบบฟอร์มที่ 1 สำเร็จ!");
    } else if (currentFormSet === 2) {
      setUserState({
        ...userState,
        isSecondFormSubmitted: true
      });
      alert("ส่งแบบฟอร์มที่ 2 สำเร็จ!");
    } else if (currentFormSet === 3) {
      alert("ขอบคุณสำหรับข้อเสนอแนะของคุณ!");
    }
    
    setAnswers({});
  };

  const resetUserState = () => {
    setUserState({
      isFirstTime: true,
      isFirstFormSubmitted: false,
      isSecondFormSubmitted: false
    });
    setAnswers({});
  };

  if (!currentSetData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <Banner imgSource="public/banner/example.svg" />

      <div className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-[600px] mx-auto space-y-6 sm:space-y-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary text-center">
            {currentSetData.formLabel}
          </h1>

          <div className="space-y-8 sm:space-y-12">
            {currentSetData.questions.map((question) => {
              const currentAnswer = answers[question.id] || [];
              const maxAnswer = parseInt(question.maxAnswer) || 1;
              
              return (
                <div key={question.id} className="space-y-4 sm:space-y-6">
                  <h2 className="text-base sm:text-lg font-semibold text-primary">
                    {currentSetData.questions.indexOf(question) + 1}. {question.label}
                    {maxAnswer > 1 && (
                      <span className="text-sm text-gray-500 ml-2">
                        (เลือกได้สูงสุด {maxAnswer} ข้อ)
                      </span>
                    )}
                  </h2>
                  {question.type === "rating" ? (
                    <div className="grid grid-cols-5 gap-2 justify-items-center">
                      {RATING_OPTIONS.map((option, index) => (
                        <ChoiceCheck
                          key={`${question.id}-rating-${index}`}
                          text={option}
                          isSelect={currentAnswer.includes(index)}
                          onChange={() => handleSelectAnswer(question.id, index, 1)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {question.options?.map((option, index) => (
                        <ChoiceSelect
                          key={`${question.id}-${index}`}
                          text={option}
                          isSelect={currentAnswer.includes(index)}
                          onClick={() => handleSelectAnswer(question.id, index, question.maxAnswer)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center pt-8 pb-8">
            <button
              onClick={handleSubmit}
              className="btn-normal-active disable:btn-normal-inactive"
            >
              ส่งแบบฟอร์ม
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Surveypage;