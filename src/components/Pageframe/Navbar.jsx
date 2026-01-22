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
                        className="btn-logout group flex items-center gap-2"
                        onClick={handleLogout}
                    >
                        <svg width="21" height="17" viewBox="0 0 21 17" className="w-6 h-6 group hover:text-white fill-current" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_373_10094)">
                            <path fill="currentColor" d="M9.81787 15.5295H4.08899C2.53208 15.5295 1.26884 14.5786 1.26884 13.4144V3.05905C1.26884 1.89137 2.53674 0.943936 4.08899 0.943936H9.91109C10.2607 0.943936 10.5404 0.734172 10.5404 0.471968C10.5404 0.209764 10.2607 0 9.91109 0H4.08899C1.83753 0 0.0102539 1.37395 0.0102539 3.05905V13.4144C0.0102539 15.103 1.84219 16.4734 4.08899 16.4734H9.81787C10.1675 16.4734 10.4472 16.2637 10.4472 16.0015C10.4472 15.7393 10.1628 15.5295 9.81787 15.5295Z"/>
                            <path fill="currentColor" d="M20.185 7.90421L16.1855 4.90459C15.9385 4.7193 15.5423 4.7193 15.2952 4.90459C15.0482 5.08988 15.0482 5.38705 15.2952 5.57234L18.2226 7.76787H5.45497C5.10537 7.76787 4.82568 7.97763 4.82568 8.23983C4.82568 8.50204 5.10537 8.7118 5.45497 8.7118H18.2226L15.2952 10.9073C15.0482 11.0926 15.0482 11.3898 15.2952 11.5751C15.4164 11.666 15.5796 11.7149 15.738 11.7149C15.8965 11.7149 16.0597 11.6695 16.1809 11.5751L20.1804 8.57546C20.4321 8.38667 20.4321 8.08601 20.185 7.90421Z"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_373_10094">
                            <rect width="21" height="16.5" fill="white"/>
                            </clipPath>
                            </defs>
                        </svg>
                        <p className="hidden sm:block group-hover:text-white"> ออกจากระบบ </p>
                    </button>
                ) : (
                    <button className="btn-login" onClick={()=>navigate("/login")} > เข้าสู่ระบบ </button>
                )}
            </div>
        </div>
    );
}