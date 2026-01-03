import React from "react";
import { useNavigate } from "react-router-dom";

export default function ContactCard({
  imageSource,
  title,
  description,
  tel,
  link,
}) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(link)}
      className="
        w-full
        max-w-[655px]
        bg-white
        flex
        items-start
        gap-4
        sm:gap-6
        rounded-md
        p-4
        sm:p-6
        text-left
        shadow-lg
        hover:shadow-xl
        transition
      "
    >
        <div>
      <img
        src={imageSource}
        alt={title}
        className="w-[56px] h-[56px] sm:w-[72px] sm:h-[72px] flex-shrink-0 rounded-full"
      />
       </div>

      <div className="flex flex-col flex-1 min-w-0">
        <h3 className="text-text font-bold text-sm sm:text-base mb-2 sm:mb-3 max-w-xs leading-snug">
          {title}
        </h3>
        
        <p className="text-text/70 text-xs sm:text-sm mb-1 sm:mb-2 leading-relaxed">
          {description}
        </p>
        
        <p className="text-text/70 text-xs sm:text-sm">
          {tel}
        </p>
      </div>

      <div className="hidden sm:block w-20 flex-shrink-0"></div>
    </button>
  );
}