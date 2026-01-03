import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Pageframe() {
  return (
    <div className="font-display h-screen w-screen overflow-hidden flex items-center justify-center bg-cover bg-center p-4 sm:p-6"
      style={{
        backgroundImage: "url('/bg.webp')",
      }}>
        
        
        <div className="w-full max-w-[1312px] h-full max-h-[996px] flex flex-col shadow-xl rounded-3xl">

        <Navbar />

        <main className="flex-1 overflow-y-auto bg-background rounded-b-3xl">
          <Outlet />
        </main>

      </div>
    </div>
  );
}