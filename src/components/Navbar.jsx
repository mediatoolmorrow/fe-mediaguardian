import React from "react";
import Button from "./Button";
import logoutIcon from "../assets/icon/logout.svg";

export default function Navbar(){
    return (
        <div className="w-screen max-h-[115px] max-h-[80px] bg-color-navbar flex justify-between py-4 px-6 sm:px-16 ">
            <div className="flex h-[53px] gap-3 justify-center">
                <img src="./favicon.svg" /> 
                <div className="flex flex-col text-start justify-center"> 
                    <p className="font-bold"> ชุมชนเฝ้าระวังสื่อ </p>
                    <p> Media Guardians </p>
                </div>
            </div>
            <div className="">
                <Button
                text="Login"
                variant="loginButton"
                />
            </div>
        </div>
    );
}