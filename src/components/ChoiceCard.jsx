import React from "react";

export default function ChoiceCard({
  title,
  iconSource,
  selected,
  onClick,
  disabled,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group p-4 rounded-lg shadow-md transition-all ${
        selected
          ? "bg-accent"
          : disabled
          ? "bg-white cursor-not-allowed opacity-50"
          : "hover:bg-accent hover:shadow-md"
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
