import React from "react";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar(){
    const navigate = useNavigate();
    const { backendUser, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="max-w-screen max-h-[115px] max-h-[80px] bg-navbar flex justify-between py-4 px-6 sm:px-16 rounded-none sm:rounded-3xl sm:rounded-b">
            <div className="flex h-[53px] gap-3 justify-center">
                <img src="/favicon.svg" className="scale-125"/>
                <div className="flex flex-col -space-y-1 text-start justify-center">
                    <p className="font-bold text-base sm:text-lg "> ชุมชนเฝ้าระวังสื่อ </p>
                    <p className="font-light text-base">  Media Guardians </p>
                </div>
            </div>
            <div className="">
                {backendUser ? (
                    <button
                        className="btn-login flex items-center gap-2"
                        onClick={handleLogout}
                    >
                        <img src="/icon/logout.svg" alt="logout" className="w-5 h-5" />
                        ออกจากระบบ
                    </button>
                ) : (
                    <button className="btn-login" onClick={()=>navigate("/login")} > เข้าสู่ระบบ </button>
                )}
            </div>
        </div>
    );
}