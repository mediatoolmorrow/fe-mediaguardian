import React from "react";
import Button from "../Button";
import logoutIcon from "../../assets/icon/logout.svg";

export default function Navbar(){
    return (
        <div className="max-w-screen max-h-[115px] max-h-[80px] bg-navbar flex justify-between py-4 px-6 sm:px-16 rounded-none sm:rounded-3xl sm:rounded-b">
            <div className="flex h-[53px] gap-3 justify-center">
                <img src="./favicon.svg" /> 
                <div className="flex flex-col -space-y-1 text-start justify-center"> 
                    <p className="font-bold text-sm sm:text-base "> ชุมชนเฝ้าระวังสื่อ </p>
                    <p className="font-light text-sm">  Media Guardians </p>
                </div>
            </div>
            <div className="">
                <Button
                text="เข้าสู่ระบบ"
                variant="loginButton"
                />
            </div>
        </div>
    );
}