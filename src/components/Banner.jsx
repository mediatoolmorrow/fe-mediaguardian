import React from "react";

export default function Banner({ imgSource }) {
  return (
    <div className="w-full sm:w-[calc(100%+20px)] h-[133px] overflow-hidden">
      <img
        src={imgSource}
        alt="Banner"
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
}
