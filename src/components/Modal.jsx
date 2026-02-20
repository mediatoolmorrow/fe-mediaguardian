import React, { useState, useEffect } from "react";
import Button from "./Button";

export default function Modal({ url = "https://mediaguardians-development.vercel.app/", title = "Media Guardians", onClose }) {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
      setCanShare(navigator.share !== undefined && mobile);
    };
    checkMobile();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setShowToast(true);
      setTimeout(() => {
        setCopied(false);
        setShowToast(false);
      }, 2000);
    } catch (err) {

      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setShowToast(true);
      setTimeout(() => {
        setCopied(false);
        setShowToast(false);
      }, 2000);
    }
  };

  const handleMobileShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `อยากชวนทุกคนมาลองใช้ดู
ตัวช่วยที่จะทำให้การสื่อสารของเราสร้างสรรค์ขึ้น
#MediaGuardians #ชุมชนเฝ้าระวังสื่อ

${url}`,
        });
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    }
  };

  const socialShare = [
    {
      name: "Facebook",
      icon: "/social-media/facebook.svg",
      onClick: () => {
        // Note: Facebook pulls text from Open Graph meta tags on the shared URL
        // The 'quote' parameter is deprecated and unreliable
        // For custom text to appear, add og:description meta tag to your website
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank"
        );
      },
    },
    {
      name: "Twitter",
      icon: "/social-media/twitter.svg",
      onClick: () =>
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent('อยากชวนทุกคนมาลองใช้ดู\nตัวช่วยที่จะทำให้การสื่อสารของเราสร้างสรรค์ขึ้น\n#MediaGuardians #ชุมชนเฝ้าระวังสื่อ')}`,
          "_blank"
        ),
    },
    {
      name: "LINE",
      icon: "/social-media/line.svg",
      onClick: () =>
        window.open(
          `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent('อยากชวนทุกคนมาลองใช้ดู\nตัวช่วยที่จะทำให้การสื่อสารของเราสร้างสรรค์ขึ้น\n#MediaGuardians #ชุมชนเฝ้าระวังสื่อ')}`,
          "_blank"
        ),
    },
  ];

  return (
    <>
      {showToast && (
        <div
          className="fixed bottom-1/2 left-1/2 traslate-x-1/2 translate-y-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-[60] animate-fade-in-out"
          onClick={(e) => e.stopPropagation()}
        >
          คัดลอกแล้ว
        </div>
      )}

      <div
        className="relative shadow min-h-[338px] min-w-[340px] max-w-[703px] max-h-[500px] rounded-xl bg-white sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-4 -right-4 transition hover:opacity-80"
        >
          <img
            src="/icon/close.svg"
            alt="close"
            className="w-full h-full"
          />
        </button>

      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-xl font-bold mb-4">แชร์ลิงก์</p>
        {canShare && (
          <Button
            text="แชร์ผ่านเมนูมือถือ"
            variant="normalActive"
            onClick={handleMobileShare}
          />
        )}

        <div className={`flex gap-3 ${canShare ? 'mt-6' : 'mt-0'}`}>
          {socialShare.map((item) => (
            <button
              key={item.name}
              onClick={item.onClick}
              className="w-11 h-11 rounded-full border border-button/20 bg-white flex items-center justify-center hover:bg-accent/20 transition-colors"
            >
              <img src={item.icon} alt={item.name} className="w-full h-full" />
            </button>
          ))}
        </div>

        <div className="flex flex-col justify-between w-[326px] h-[105px] p-4 mt-6 rounded-xl bg-button/20">
          <p className="text-base font-medium">ลิงก์สำหรับคัดลอก</p>

          <div className="flex items-center justify-between px-3 h-[38px] rounded-md border border-button/20 bg-white">
            <p className="text-sm truncate flex-1 mr-2">{url}</p>

            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 text-xs px-2 py-1 rounded transition-colors ${
                copied
                  ? 'bg-green-100 text-green-700'
                  : 'hover:bg-button/10'
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  คัดลอกแล้ว!
                </>
              ) : (
                <>
                  <img
                    src="/icon/copy.svg"
                    alt="Copy"
                    className="w-3.5 h-3.5"
                  />
                  คัดลอก
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}