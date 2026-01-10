import React from "react";
import Button from "../Button";
import { useNavigate } from "react-router-dom";

export default function ResultSummary({ description }) {
  const navigate = useNavigate();
  return (
    <div
      className="
        w-full
        max-w-[648px]
        flex
        flex-row
        items-start
        gap-3
        p-4
      "
    >
      <img
        src="/icon/result.svg"
        className="w-10 h-10 flex-shrink-0"
        alt="Result"
      />

      <div className="flex flex-col flex-1">
        <p className="mb-1 font-bold text-sm">
          แนวทางการตอบกลับ
        </p>

        <p className="mb-4 text-xs text-text break-words">
          {description}
        </p>

        <div className="flex justify-center mt-auto">
          <button className="btn-normal-active" onClick={()=>navigate("/result/example")}> เลือกแนวนี้ </button>
        </div>
      </div>
    </div>
  );
}

