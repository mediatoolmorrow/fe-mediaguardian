import React, { useState } from "react";

export default function PromptBox() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("text");

  const mode = [
    {
      id: "text",
      displayName: "Text Content",
      icon: "/src/assets/icon/message.svg",
    },
    {
      id: "link",
      displayName: "Link Content",
      icon: "/src/assets/icon/link.svg",
    },
    {
      id: "image",
      displayName: "Image Content",
      icon: "/src/assets/icon/image.svg",
    },
  ];

  const current = mode.find((m) => m.id === selected);

  return (
    <div className="max-w-[647px] max-h-[180px] min-h-[136px] border border-primary rounded-2xl p-4 space-y-3">
        <div className="w-full min-h-[60px] max-h-[80px] border border-primary rounded-lg px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-primary">
        <textarea
            placeholder="วางเนื้อหาของคุณที่นี่..."
            className="w-full h-full resize-none bg-transparent text-sm outline-none placeholder:text-gray-400"
            rows={2}
        />
        </div>
        <div> 
            <div className="relative w-[133px]">
                <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full h-[27px] text-white bg-primary rounded-lg px-2 flex items-center justify-between text-xs"
                >
                <div className="flex items-center gap-2">
                    <img src={current.icon} className="w-3 h-3" alt="" />
                    <span>{current.displayName}</span>
                </div>

                <img src="src/assets/icon/dropdown.svg" alt="" />
                </button>

                {open && (
                <div className="absolute top-full mt-1 z-10 w-full bg-white border border-[#F0F0F0] rounded-lg shadow p-1">
                    {mode
                    .filter((item) => item.id !== selected)
                    .map((item) => (
                        <button
                        key={item.id}
                        onClick={() => {
                            setSelected(item.id);
                            setOpen(false);
                        }}
                        className="group w-full px-2 py-1.5 flex items-center gap-2 text-xs text-text hover:bg-primary hover:text-white rounded-lg transition-colors"
                        >
                        <img 
                            src={item.icon} 
                            className="w-3 h-3 brightness-50 group-hover:brightness-0 group-hover:invert transition-all"
                            alt=""
                        />
                        <span>{item.displayName}</span>
                        </button>
                    ))}
                </div>
                )}
            </div>
        </div>
    </div>
  );
}