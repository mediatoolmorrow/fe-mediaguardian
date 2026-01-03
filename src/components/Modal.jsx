import React from "react";
import Button from "./Button";

export default function Modal() {
  const socialShare = [
    {
      name: "Facebook",
      icon: "/src/assets/social-media/facebook.svg",
      onClick: () =>
        window.open(
          "https://www.facebook.com/sharer/sharer.php?u=https://mediaguardians.com",
          "_blank"
        ),
    },
    {
      name: "Twitter",
      icon: "/src/assets/social-media/twitter.svg",
      onClick: () =>
        window.open(
          "https://twitter.com/intent/tweet?url=https://mediaguardians.com",
          "_blank"
        ),
    },
    {
      name: "LINE",
      icon: "/src/assets/social-media/line.svg",
      onClick: () =>
        window.open(
          "https://social-plugins.line.me/lineit/share?url=https://mediaguardians.com",
          "_blank"
        ),
    },
    {
      name: "IG",
      icon: "/src/assets/social-media/ig.svg",
      onClick: () =>
        window.open(
          "https://social-plugins.line.me/lineit/share?url=https://mediaguardians.com",
          "_blank"
        ),
    },
  ];

  return (
    <div className="min-h-[338px] min-w-[395px] max-w-[703px] rounded-xl p-6 bg-white shadow">
      <div className="flex justify-end">
        <img src="/src/assets/icon/close.svg" alt="close" />
      </div>

    <div className="flex flex-col items-center justify-center"> 
      <p className="text-xl font-bold mb-4">แชร์ลิงก์</p>

      <Button text="แชร์ผ่านเมนูมือถือ" variant="normalActive" />

      <div className="flex gap-3 mt-6">
        {socialShare.map((item) => (
          <button
            key={item.name}
            onClick={item.onClick}
            className="w-11 h-11 rounded-full border border-button/20 bg-white flex items-center justify-center hover:bg-accent/20 transition-colors"
          >
            <img src={item.icon} alt={item.name} className="w-ful h-full" />
          </button>
        ))}
      </div>

      <div className="flex flex-col justify-between w-[326px] h-[105px] p-4 mt-6 rounded-xl bg-button/20">
        <p className="text-base font-medium">ลิงก์สำหรับคัดลอก</p>

        <div className="flex items-center justify-between px-3 h-[38px] rounded-md border border-button/20 bg-white">
          <p className="text-sm truncate">https://mediaguardians.com</p>

          <button className="flex items-center gap-2 text-xs px-2 hover:bg-button/10 rounded">
            <img
              src="/src/assets/icon/copy.svg"
              alt="Copy"
              className="w-3.5 h-3.5"
            />
            Copy
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
