import React from "react";
import { useNavigate } from "react-router-dom";
import AnswerBox from "../components/AnswerBox";
import RESULT_DATA from "../components/data/resultData.json";

function ResultPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 p-4">
      {Object.keys(RESULT_DATA).map((sessionKey) => (
        <div key={sessionKey} className="border rounded p-2">
          {RESULT_DATA[sessionKey].map((item, idx) => (
            <AnswerBox key={sessionKey + idx} data={item} />
          ))}

          <button
            className="w-full text-xs font-semibold rounded-md py-1 mt-2 bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => navigate(`/result/${sessionKey}`)}
          >
            เลือกและแก้ไข
          </button>
        </div>
      ))}
    </div>
  );
}

export default ResultPage;
