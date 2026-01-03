import React from "react";

export default function ChoiceCard({
  title,
  imageSource,
  prompt,
  selected = false,
}) {
  return (
    <div
      className={`max-h-[100px] max-w-[650px] min-h-[80px] min-w-[395px] rounded-md
        flex flex-col items-center justify-center shadow-md transition
        ${
          selected
            ? "bg-accent text-white"
            : "bg-white text-text"
        }
      `}
    >
      <img
        src={imageSource}
        alt={title}
        className={`w-7 h-7 sm:w-8 sm:h-8
          ${selected ? "filter brightness-0 invert" : ""}
        `}
      />

      <p className="text-xs sm:text-sm font-bold">
        {title}
      </p>
    </div>
  );
}
