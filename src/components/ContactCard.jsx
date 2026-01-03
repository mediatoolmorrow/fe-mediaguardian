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
      className="w-full bg-white flex flex-col rounded-md p-4 px-12 text-left hover:shadow transition shadow-lg max-w-[648px] max-h-[186px] min-w-[397px] min-h-[158px]"
    >
        <div className="flex items-center gap-6 ">
            <img
            src={imageSource}
            alt={title}
            className="min-w-[56px] min-h-[56px] max-w-[72px] max-h-[72px] rounded"
            />
            <p className="text-text font-bold leading-snug max-w-3xs text-sm">{title}</p>
        </div>
        <div className="mb-4 mt-2 space-y-3">
            <p className="text-medium text-sm mt-1 max-w-2xs text-xs">{description}</p>
            <p className="text-medium text-sm mt-1 max-w-2xs text-xs">{tel}</p>
        </div>
    </button>
  );
}
