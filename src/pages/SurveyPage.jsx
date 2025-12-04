import React, { useState } from "react";
import surveyForm from "../components/data/surveyForm.json"

function SurveyPage() {
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showShare, setShowShare] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const firstPageQuestions = surveyForm.questions.filter(q => q.value !== "next_step");
  const nextStepQuestion = surveyForm.questions.find(q => q.value === "next_step");

  const handleChange = (questionKey, optionValue) => {
    setAnswers((prev) => ({
      ...prev,
      [questionKey]: optionValue,
    }));

    if (questionKey === "next_step") {
      if (optionValue === "report") {
        alert("navigate to /contact");
      }
      if (optionValue === "share_to_social") {
        setShowShare(true);
      }
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    
    switch(platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'line':
        window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        });
        break;
      default:
        break;
    }
  };

  const isRatingQuestion = (type) => type === "rating";

  const isFirstPageComplete = firstPageQuestions.every(q => answers[q.value]);

  const goToNextStep = () => {
    if (isFirstPageComplete) {
      setCurrentStep(2);
    }
  };

  const goBackToFirstStep = () => {
    setCurrentStep(1);
  };

  return (
    <div className="p-6 space-y-10 max-w-3xl mx-auto">
      {currentStep === 1 && (
        <>
          {firstPageQuestions.map((q) => (
            <div key={q.value} className="space-y-3">
              <p className="font-semibold text-gray-800">{q.labelth}</p>

              <div className={`flex flex-col gap-3 ${isRatingQuestion(q.type) ? 'md:flex-row md:flex-wrap md:justify-center md:gap-4' : ''}`}>
                {q.options.map((opt) => (
                  <label
                    key={opt.value}
                    className={`
                      ${isRatingQuestion(q.type) 
                        ? 'flex flex-col items-center p-4 w-24 border rounded-xl cursor-pointer transition hover:shadow-md' 
                        : 'flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition hover:shadow-md w-full'
                      }
                      ${answers[q.value] === opt.value ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
                    `}
                  >
                    <input
                      type="radio"
                      name={q.value}
                      value={opt.value}
                      checked={answers[q.value] === opt.value}
                      onChange={() => handleChange(q.value, opt.value)}
                      className="hidden"
                    />

                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition flex-shrink-0
                      ${answers[q.value] === opt.value ? "border-blue-500 bg-blue-500 text-white" : "border-gray-400 text-transparent"}
                    `}
                    >
                      ✓
                    </div>

                    <span className={`text-sm ${isRatingQuestion(q.type) ? 'text-center mt-2' : 'text-left'} ${answers[q.value] === opt.value ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <button
              onClick={goToNextStep}
              disabled={!isFirstPageComplete}
              className={`px-8 py-3 rounded-lg font-medium transition ${
                isFirstPageComplete
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              ถัดไป →
            </button>
          </div>
        </>
      )}

      {currentStep === 2 && nextStepQuestion && (
        <>
          <div className="space-y-3">
            <p className="font-semibold text-gray-800">{nextStepQuestion.labelth}</p>

            <div className="flex flex-col gap-3">
              {nextStepQuestion.options.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition hover:shadow-md w-full
                    ${answers[nextStepQuestion.value] === opt.value ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
                  `}
                >
                  <input
                    type="radio"
                    name={nextStepQuestion.value}
                    value={opt.value}
                    checked={answers[nextStepQuestion.value] === opt.value}
                    onChange={() => handleChange(nextStepQuestion.value, opt.value)}
                    className="hidden"
                  />

                  <span className={`text-sm text-left ${answers[nextStepQuestion.value] === opt.value ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-start pt-4">
            <button
              onClick={goBackToFirstStep}
              className="px-8 py-3 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              ← ย้อนกลับ
            </button>
          </div>
        </>
      )}

      {showShare && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm space-y-4">
            <p className="font-semibold text-gray-700 text-center text-lg">แชร์ข้อมูลนี้</p>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => handleShare('facebook')}
                className="w-full p-3 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition flex items-center justify-center gap-2"
              >
                <span className="text-blue-600">📘</span> Facebook
              </button>
              <button 
                onClick={() => handleShare('line')}
                className="w-full p-3 border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-400 transition flex items-center justify-center gap-2"
              >
                <span className="text-green-600">💬</span> Line
              </button>
              <button 
                onClick={() => handleShare('copy')}
                className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition flex items-center justify-center gap-2"
              >
                <span>🔗</span> {copySuccess ? 'คัดลอกแล้ว!' : 'Copy Link'}
              </button>
            </div>

            <button
              onClick={() => setShowShare(false)}
              className="w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SurveyPage;