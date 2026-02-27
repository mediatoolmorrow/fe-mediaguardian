import React, { useRef } from "react";

export default function ChoiceCard({
  title,
  iconSource,
  selected,
  onClick,
  disabled,
}) {
  const isProcessing = useRef(false);

  const handleClick = (e) => {
    e.preventDefault();

    // Prevent double-tap on mobile
    if (isProcessing.current || disabled) return;

    isProcessing.current = true;
    onClick?.();

    // Reset after a short delay
    setTimeout(() => {
      isProcessing.current = false;
    }, 300);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`group p-4 rounded-lg shadow-md transition-all touch-manipulation select-none ${
        selected
          ? "bg-accent"
          : disabled
          ? "bg-white cursor-not-allowed opacity-50"
          : "bg-white hover:bg-accent hover:shadow-md"
      }`}
    >
      <div className="flex flex-col items-center gap-2">
        <img
          src={iconSource}
          alt={title}
          className={`w-12 h-12 object-contain ${
            selected ? "brightness-0 invert" : "group-hover:brightness-0 group-hover:invert"
          }`}
          onError={(e) => {
            e.target.src = "/icons/default.svg";
          }}
        />

        <div
          className={`text-sm font-medium text-center ${
            selected ? "text-white" : "group-hover:text-white text-gray-700"
          }`}
        >
          {title}
        </div>
      </div>
    </button>
  );
}
