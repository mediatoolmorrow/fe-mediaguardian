import React from "react";
import Login from "../components/login";

function Loginpage (){
    return (
        <div className="bg-white flex flex-col justify-center w-full h-full items-center">
            <div className="text-center mb-8 ">
                <div className="flex justify-center mb-4">
                    <img
                        src="./favicon.svg"
                        alt="Media Guardians"
                        className="w-24 h-24"
                    />
                </div>
                <h1 className="text-2xl font-bold mb-1">ชุมชนเฝ้าระวังสื่อ</h1>
                <p className="text-sm font-bold">Media Guardians</p>
            </div>
            <Login />
        </div>
    );
}

export default Loginpage;