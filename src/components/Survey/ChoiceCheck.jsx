import React from "react";

export default function ChoiceCheck({ text, isSelect, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex items-center gap-2 max-w-[55px] min-h-[61px] justify-center flex-col focus:outline-none"
    >
      <div
        className={`
          w-[40px] h-[40px] rounded-full border flex items-center justify-center
          transition-all
          ${
            isSelect
              ? "bg-accent border-accent"
              : "bg-transparent hover:bg-accent hover:border-accent border-text"
          }
        `}
      >
        <img
          src="public/icon/choice-check.svg"
          alt=""
          className={`
            w-4 h-4 transition-all
            ${isSelect ? "invert" : "group-hover:invert"}
          `}
        />
      </div>

      <p
        className={`text-[10px] font-bold whitespace-nowrap leading-none ${
          isSelect ? "text-accent" : "text-text"
        }`}
      >
        {text}
      </p>
    </button>
  );
}
