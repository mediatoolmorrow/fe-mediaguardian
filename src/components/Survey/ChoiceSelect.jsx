import React from "react";

export default function ChoiceSelect({ text, isSelect }) {
  return (
    <button
      className={`
        group
        max-h-[80px] max-w-[431px]
        min-h-[60px] min-w-[398px]
        border border-button rounded-md
        transition-colors
        ${
          isSelect
            ? "bg-accent"
            : "bg-white hover:bg-accent"
        }
      `}
    >
      <p
        className={`
          font-medium text-xs transition-colors
          ${
            isSelect
              ? "text-white"
              : "text-text group-hover:text-white"
          }
        `}
      >
        {text}
      </p>
    </button>
  );
}
