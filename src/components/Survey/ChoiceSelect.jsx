import React from "react";

export default function ChoiceSelect({ text, isSelect }) {
  return (
    <button
      className={`
        p-4
        max-h-[80px] max-w-[431px]
        min-h-[60px] min-w-[360px]
        border border-button rounded-md
        transition-colors
        ${
          isSelect
            ? "bg-accent"
            : "bg-white hover:bg-accent"
        }
      `}
    >
      <p className={`font-medium text-xs hover:text-white ${
          isSelect
            ? "text-white"
            : "hover:text-white text-text"
        }`}>{text} 
        </p>
    </button>
  );
}
