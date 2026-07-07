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
  const isFullscreen = ["/", "/pdpa"].includes(pathname);
  const scrollRef = useRef(null);

  return (
    <div className={`font-display h-screen w-screen overflow-hidden flex items-center justify-center bg-cover bg-center ${isFullscreen ? "" : "sm:p-6"}`}
      style={{
        backgroundImage: "url('/bg.webp')",
      }}>
            <div className={`
            w-full h-full
            flex flex-col
            bg-white
            overflow-hidden
            ${isFullscreen ? "" : "sm:max-w-[1312px] sm:max-h-[996px] shadow-2xl rounded-none sm:rounded-3xl"}
            `}>

            {!hideNavbar && <Navbar />}

        <div className="flex-1 relative overflow-hidden">
          <main id="main-scroll" ref={scrollRef} className="h-full overflow-y-auto overflow-x-hidden bg-background sm:[scrollbar-gutter:stable]">
            <Outlet />
          </main>
          <MobileScrollbar scrollEl={scrollRef} />
        </div>

      </div>
    </div>
  );
}