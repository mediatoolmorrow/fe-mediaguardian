import React from "react";

export default function ChoiceBox({ text, isSelect, onChange }) {
  return (
    <label className="flex items-center gap-2 max-w-[55px] min-h-[61px] justify-center flex-col cursor-pointer">
      <input
        type="checkbox"
        checked={isSelect}
        onChange={onChange}
        className="sr-only"
      />
      <div
        className={`
          w-[40px] h-[40px] rounded-lg border-2 flex items-center justify-center
          transition-all group
          ${
            isSelect
              ? "bg-accent border-accent"
              : "bg-transparent hover:border-accent border-text"
          }
        `}
      >
        {isSelect && (
          <img
            src="/icon/choice-check.svg"
            alt="check"
            className="w-4 h-4 invert"
          />
        )}
      </div>

      <p className="text-text font-bold text-xs">
        {text}
      </p>
    </label>
  );
}