import React from "react";
import { useNavigate } from "react-router-dom";

function Tutorialpage() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center bg-white w-full h-full p-4 sm:p-8">
            <div className="space-y-6 sm:space-y-12 items-center flex flex-col text-center max-w-[500px] w-full">
                <div className="w-full flex-shrink-0"> 
                    <iframe 
                        className="rounded-2xl sm:rounded-3xl w-full aspect-video max-w-[422px] mx-auto" 
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=EyW7kNFH0BlRURTy" 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen>
                    </iframe>
                </div>
                <div className="w-full space-y-3 sm:space-y-4 px-2 sm:px-0 flex-shrink-0">
                    <p className="text-xl sm:text-2xl font-bold">
                        วิดีโอการใช้งาน
                    </p>
                    <p className="font-light text-sm sm:text-base leading-relaxed text-gray-700">
                        Lorem ipsum dolor sit amet consectetur. Purus vitae quis auctor nunc ullamcorper. Dictum diam purus dignissim vivamus adipiscing dignissim nulla. Tincidunt amet maecenas nibh urna sit consequat. Lobortis viverra donec morbi in cras.
                        Lorem ipsum dolor sit amet consectetur. Purus vitae quis auctor nunc ullamcorper. Dictum diam purus dignissim vivamus adipiscing dignissim nulla. Tincidunt amet maecenas nibh urna sit consequat. Lobortis viverra donec morbi in cras.
                    </p>
                </div>
                <div className="flex w-full items-center justify-center">
                    <button onClick={() => navigate("/agentic")} className="btn-normal-active disable:btn-normal-inactive"> ไปต่อ </button>
                </div>
            </div>
        </div>
    );
}

export default Tutorialpage;