import React from "react";

export default function ChoiceCheck({ text, isSelect }) {
  return (
    <button className="flex items-center gap-2 max-w-[55px]  min-h-[61px] justify-center flex-col">
      <div
        className={`
          w-[40px] h-[40px] rounded-full border flex items-center justify-center
          transition-all cursor-pointer group
          ${
            isSelect
              ? "bg-accent border-accent text-white"
              : "bg-transparent hover:bg-accent hover:border-accent border-text text-primary"
          }
        `}
      >
        <img
          src="/icon/choice-check.svg"
          alt="check"
          className={`
            w-4 h-4 transition-all
            ${isSelect ? "invert" : "group-hover:invert"}
          `}
        />
      </div>

      <p className="text-text font-bold text-xs">
        {text}
      </p>
    </button>
  );
}