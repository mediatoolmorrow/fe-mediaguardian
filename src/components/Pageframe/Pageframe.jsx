import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function Pageframe() {
  const { pathname } = useLocation();
  const hideNavbar = ["/login", "/"].includes(pathname);

  return (
    <div className="font-display h-screen w-screen overflow-hidden flex items-center justify-center bg-cover bg-center sm:p-6"
      style={{
        backgroundImage: "url('/bg.webp')",
      }}>
            <div className="
            w-full h-full
            sm:max-w-[1312px] sm:max-h-[996px]
            flex flex-col
            bg-white
            shadow-2xl
            rounded-none sm:rounded-3xl
            overflow-hidden
            ">

            {!hideNavbar && <Navbar />}

        <main id="main-scroll" className="flex-1 overflow-y-auto bg-background">
            <Outlet />     
        </main>

      </div>
    </div>
  );
}