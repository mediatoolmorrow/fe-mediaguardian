import React from "react";
import Button from "../Button";

export default function ResultSummary({ description }) {
  return (
    <div
      className="
        w-full
        max-w-[648px]
        flex
        flex-col
        sm:flex-row
        gap-3
        p-4
      "
    >
      <img
        src="/src/assets/icon/result.svg"
        className="w-10 h-10 flex-shrink-0"
        alt="Result"
      />

      <div className="flex flex-col flex-1">
        <p className="mb-1 font-bold text-sm">
          ผลลัพธ์จากการประมวลผล
        </p>

        <p className="mb-4 text-xs text-text break-words">
          {description}
        </p>

        <div className="mt-auto">
          <Button
            text="เลือกและแก้ไข"
            variant="normalActive"
            className="w-full sm:w-auto"
          />
        </div>
      </div>
    </div>
  );
}
