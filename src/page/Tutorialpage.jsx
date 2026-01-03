import React from "react";
import Button from "../components/Button";

function Tutorialpage (){
    return (
        <div className="flex flex-col items-center justify-center flex flex-col bg-white w-full h-full">
            <div className="space-y-12 items-center flex flex-col text-center">
                <div className=""> 
                    <iframe className="rounded-3xl max-h-[230px] max-w-[422px] min-h-[215px] min-w-[395px]" src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=EyW7kNFH0BlRURTy" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
                <div className="w-sm space-y-4">
                    <p className="text-2xl font-bold">
                        วิดีโอการใช้งาน
                    </p>
                    <p className="font-light">
                        Lorem ipsum dolor sit amet consectetur. Purus vitae quis auctor nunc ullamcorper. Dictum diam purus dignissim vivamus adipiscing dignissim nulla. Tincidunt amet maecenas nibh urna sit consequat. Lobortis viverra donec morbi in cras.
                        Lorem ipsum dolor sit amet consectetur. Purus vitae quis auctor nunc ullamcorper. Dictum diam purus dignissim vivamus adipiscing dignissim nulla. Tincidunt amet maecenas nibh urna sit consequat. Lobortis viverra donec morbi in cras.
                    </p>
                </div>
                <div>
                    <Button 
                    text = "ต่อไป"
                    variant="normalActive" />
                </div>
            </div>
        </div>
    );
}

export default Tutorialpage;