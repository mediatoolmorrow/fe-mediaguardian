import React from "react";

export default function ChoiceSelect({ text, isSelect, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        p-4
        max-h-[80px] max-w-[431px]
        min-h-[60px] min-w-[360px]
        border border-button rounded-md
        transition-colors group
        ${
          isSelect
            ? "bg-accent"
            : "bg-white hover:bg-accent"
        }
      `}
    >
      <p className={`font-medium text-sm group-hover:text-white ${
          isSelect
            ? "text-white "
            : "group-hover:text-white text-text"
        }`}>{text} 
        </p>
    </button>
  );
}