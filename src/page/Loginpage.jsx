import React, { useEffect } from "react";
import Login from "../components/Login";
import { useTrackStep } from "../hooks/useTrackStep";

function Loginpage() {
  useTrackStep(2);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('openExternalBrowser')) {
      params.delete('openExternalBrowser');
      const clean = params.toString();
      window.history.replaceState({}, '', clean ? `?${clean}` : window.location.pathname);
    }
  }, []);

  return (
    <div className="bg-white w-full sm:min-h-full min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center px-4">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <img
              src="./favicon.svg"
              alt="Media Guardians"
              className="w-20 h-20 sm:w-24 sm:h-24"
            />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold mb-1">
            ชุมชนเฝ้าระวังสื่อ
          </h1>
          <p className="text-sm font-bold">Media Guardians</p>
        </div>
        <Login />
      </div>
    </div>
  );
}

export default Loginpage;
