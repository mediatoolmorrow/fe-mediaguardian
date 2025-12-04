import React, { useState } from "react";
import surveyForm from "../components/data/surveyForm.json";

/* ----------------------------------------------------
   COMPONENT: Rating Option (แบบเรตติ้งวงกลม)
---------------------------------------------------- */
const RatingOption = ({ q, opt, active, onSelect }) => {
  return (
    <label
      className={`
        flex flex-col items-center gap-1
        max-h-[64px] max-w-[55px]
        cursor-pointer transition
      `}
    >
      <input
        type="radio"
        name={q.value}
        value={opt.value}
        checked={active}
        onChange={onSelect}
        className="hidden"
      />

      <div
        className={`
          w-[40px] h-[40px] rounded-full border-2 flex items-center justify-center
          ${active ? "border-blue-500 bg-blue-500 text-white" : "border-gray-400 text-transparent"}
        `}
      >
        ✓
      </div>

      <span
        className={`text-xs whitespace-nowrap overflow-hidden text-ellipsis truncate
          ${active ? "text-blue-600 font-medium" : "text-gray-600"}
        `}
      >
        {opt.label}
      </span>
    </label>
  );
};

/* ----------------------------------------------------
   COMPONENT: Normal Option (แบบตัวเลือกปกติ)
---------------------------------------------------- */
const NormalOption = ({ q, opt, active, onSelect }) => {
  return (
    <div> 

    <label
      className={`
        flex items-center gap-1 w-[382px] h-[80px] p-8 border rounded-md cursor-pointer transition w-full
        ${active ? "" : ""}
      `}
    >
      <input
        type="radio"
        name={q.value}
        value={opt.value}
        checked={active}
        onChange={onSelect}
        className="hidden"
      />

      <span
        className={`whitespace-nowrap overflow-hidden text-ellipsis truncate
          ${active ? "text-blue-600 font-medium" : "text-gray-600"}
        `}
      >
        {opt.label}
      </span>
    </label>
    </div>
  );
};

/* ----------------------------------------------------
   MAIN PAGE
---------------------------------------------------- */
function SurveyPage() {
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showShare, setShowShare] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const firstPageQuestions = surveyForm.questions.filter(q => q.value !== "next_step");
  const nextStepQuestion = surveyForm.questions.find(q => q.value === "next_step");

  const isRating = (q) => q.type === "rating";

  /* Handle Select */
  const handleChange = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));

    if (key === "next_step") {
      if (value === "report") alert("navigate to /contact");
      if (value === "share_to_social") setShowShare(true);
    }
  };

  /* Share Popup */
  const share = (platform) => {
    const url = window.location.href;

    if (platform === "facebook")
      return window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");

    if (platform === "line")
      return window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`, "_blank");

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const isFirstComplete = firstPageQuestions.every(q => answers[q.value]);


  return (
    <div className="">

      {/* STEP 1 ----------------------------------------------- */}
      {currentStep === 1 && (
        <>
          {firstPageQuestions.map(q => (
            <div key={q.value} className="space-y-4 mb-16 max-w-[361px] max-h-[112px]">
              <p className="text-sm font-medium">{q.labelth}</p>

              <div
                className={`flex gap-5 flex-wrap 
                ${isRating(q) ? "justify-start" : "flex-col"}
              `}
              >
                {q.options.map(opt => {
                  const active = answers[q.value] === opt.value;

                  return isRating(q) ? (
                    <RatingOption
                      key={opt.value}
                      q={q}
                      opt={opt}
                      active={active}
                      onSelect={() => handleChange(q.value, opt.value)}
                    />
                  ) : (
                    <NormalOption
                      key={opt.value}
                      q={q}
                      opt={opt}
                      active={active}
                      onSelect={() => handleChange(q.value, opt.value)}
                    />
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              disabled={!isFirstComplete}
              className={`
                px-8 py-3 rounded-lg font-medium transition
                ${isFirstComplete
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"}
              `}
            >
              ถัดไป →
            </button>
          </div>
        </>
      )}

      {/* STEP 2 ----------------------------------------------- */}
      {currentStep === 2 && nextStepQuestion && (
        <>
          <div className="space-y-3">
            <p className="font-semibold text-gray-800">{nextStepQuestion.labelth}</p>

            <div className="flex flex-col gap-3">
              {nextStepQuestion.options.map(opt => {
                const active = answers[nextStepQuestion.value] === opt.value;

                return (
                  <NormalOption
                    key={opt.value}
                    q={nextStepQuestion}
                    opt={opt}
                    active={active}
                    onSelect={() => handleChange(nextStepQuestion.value, opt.value)}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex justify-start pt-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-8 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              ← ย้อนกลับ
            </button>
          </div>
        </>
      )}

      {/* SHARE POPUP ----------------------------------------------- */}
      {showShare && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm space-y-4">
            <p className="font-semibold text-gray-700 text-center text-lg">แชร์ข้อมูลนี้</p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => share("facebook")}
                className="w-full p-3 border rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2"
              >
                📘 Facebook
              </button>

              <button
                onClick={() => share("line")}
                className="w-full p-3 border rounded-lg hover:bg-green-50 transition flex items-center justify-center gap-2"
              >
                💬 Line
              </button>

              <button
                onClick={() => share("copy")}
                className="w-full p-3 border rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                🔗 {copySuccess ? "คัดลอกแล้ว!" : "Copy Link"}
              </button>
            </div>

            <button
              onClick={() => setShowShare(false)}
              className="w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
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
