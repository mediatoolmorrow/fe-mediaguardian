import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ChoiceSelect from "../components/Survey/ChoiceSelect";
import ChoiceCheck from "../components/Survey/ChoiceCheck";
import Banner from "../components/Banner";
import { surveyTemplate } from "../utils/surveyTemplate";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const RATING_OPTIONS = [
  "ไม่เห็นด้วย",
  "ค่อนข้างไม่เห็นด้วย",
  "ไม่แน่ใจ",
  "ค่อนข้างเห็นด้วย",
  "เห็นด้วยมาก"
];

function Surveypage() {
  const { formSet } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { backendUser, refreshBackendUser } = useAuth();

  const resultId = location.state?.resultId;

  const currentFormSet = parseInt(formSet) || 1;
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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

  const handleSubmit = async () => {
    const token = localStorage.getItem('backend_token');

    if (!token) {
      setError("กรุณาเข้าสู่ระบบก่อนใช้งาน");
      return;
    }

    const unansweredQuestions = currentSetData.questions.filter(
      q => !answers[q.id] || answers[q.id].length === 0
    );

    if (unansweredQuestions.length > 0) {
      setError("กรุณาตอบคำถามให้ครบทุกข้อ");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.submitSurvey(token, currentFormSet, answers);
      await refreshBackendUser();

      if (resultId) {
        navigate(`/nextstep`, { 
          state: { surveyCompleted: true } 
        });
      } else {
        if (currentFormSet === 1) {
          navigate("/tutorial");
        } else {
          navigate("/nextstep");
        }
      }
    } catch (err) {
      console.error("Survey submission error:", err);
      setError(err.message || "เกิดข้อผิดพลาดในการส่งแบบฟอร์ม กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentSetData) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">ไม่พบแบบสอบถาม</p>
          <button
            onClick={() => navigate("/tutorial")}
            className="btn-normal-active"
          >
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <Banner imgSource="/banner/03_Agentic_Banner.webp" />

      <div className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-[600px] mx-auto space-y-6 sm:space-y-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary text-center">
            {currentSetData.formLabel}
          </h1>

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

          <div className="space-y-8 sm:space-y-12">
            {currentSetData.questions.map((question, questionIndex) => {
              const currentAnswer = answers[question.id] || [];
              const maxAnswer = parseInt(question.maxAnswer) || 1;

              return (
                <div key={question.id} className="space-y-4 sm:space-y-6">
                  <h2 className="text-base sm:text-lg font-semibold text-primary">
                    {questionIndex + 1}. {question.label}
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
              disabled={isSubmitting}
              className="btn-normal-active disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  กำลังส่ง...
                </span>
              ) : (
                "ส่งแบบฟอร์ม"
              )}
            </button>
          </div>
        </div>
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-gray-700">กำลังส่งแบบสอบถาม...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Surveypage;