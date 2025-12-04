import React from "react";

function AnswerBox({ data }) {
  return (
    <div className="max-w-[339px] max-h-[141px] rounded-lg flex gap-3 overflow-hidden">
      <div className="flex-shrink-0">
        <img 
          src="https://placehold.co/34x26"
          className="max-w-[34px] max-h-[26px] object-cover rounded-xs"
        />
      </div>

      <div className="flex flex-col justify-between w-full">

        <p className="font-semibold text-sm line-clamp-1 mb-1">
          {data.topic}
        </p>

        <p className="text-xs text-gray-600 line-clamp-4 mb-3">
          {data.description}
        </p>
      </div>
    </div>
  );
}

export default AnswerBox;
