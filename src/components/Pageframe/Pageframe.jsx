import React, { useRef, useState, useEffect, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

function MobileScrollbar({ scrollEl }) {
  const [thumbTop, setThumbTop] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [visible, setVisible] = useState(false);

  const compute = useCallback(() => {
    const el = scrollEl.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const canScroll = scrollHeight > clientHeight;
    setVisible(canScroll);
    if (!canScroll) return;
    const ratio = clientHeight / scrollHeight;
    setThumbHeight(Math.max(ratio * 100, 10));
    setThumbTop((scrollTop / (scrollHeight - clientHeight)) * (100 - Math.max(ratio * 100, 10)));
  }, [scrollEl]);

  useEffect(() => {
    const el = scrollEl.current;
    if (!el) return;
    compute();
    el.addEventListener("scroll", compute, { passive: true });
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", compute);
      ro.disconnect();
    };
  }, [compute, scrollEl]);

  if (!visible) return null;

  return (
    <div className="absolute right-0 top-0 bottom-0 w-1.5 sm:hidden" style={{ background: "#E5E7EB" }}>
      <div
        className="absolute w-full rounded-full transition-none"
        style={{
          background: "#24A9C4",
          top: `${thumbTop}%`,
          height: `${thumbHeight}%`,
        }}
      />
    </div>
  );
}

export default function Pageframe() {
  const { pathname } = useLocation();
  const hideNavbar = ["/login", "/", "/pdpa"].includes(pathname);
  const isPdpa = ["/", "/pdpa"].includes(pathname);
  const scrollRef = useRef(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const pdpaAspect = isPdpa ? (isMobile ? "1080/1920" : "1312/966") : undefined;

  return (
    <div className={`font-display h-screen w-screen overflow-hidden flex items-center justify-center bg-cover bg-center sm:p-6 ${isPdpa ? "pb-[80px] sm:pb-[52px]" : ""}`}
      style={{
        backgroundImage: "url('/bg.webp')",
      }}>
            <div
              className={`flex flex-col bg-white shadow-2xl overflow-hidden ${isPdpa ? "rounded-none sm:rounded-3xl" : "w-full h-full sm:max-w-[1312px] sm:max-h-[996px] rounded-none sm:rounded-3xl"}`}
              style={isPdpa ? { height: "100%", width: "auto", aspectRatio: pdpaAspect, maxWidth: "100%" } : undefined}
            >

            {!hideNavbar && <Navbar />}

        <div className="flex-1 relative overflow-hidden">
          <main id="main-scroll" ref={scrollRef} className={`h-full overflow-x-hidden bg-background ${isPdpa ? "overflow-y-hidden" : "overflow-y-auto sm:[scrollbar-gutter:stable]"}`}>
            <Outlet />
          </main>
          {!isPdpa && <MobileScrollbar scrollEl={scrollRef} />}
        </div>

      </div>
    </div>
  );
}