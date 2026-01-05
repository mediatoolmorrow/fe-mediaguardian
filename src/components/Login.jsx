import React, { useState } from "react";
import Button from "./Button";

export default function Login() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignUp) {
            console.log("Sign up:", { email, password });
        } else {
            console.log("Sign in:", { email, password });
        }
    };

    const socialLogins = [
        {
            name: "Facebook",
            icon: "/social-media/facebook.svg",
            onClick: () => console.log("Facebook login"),
        },
        {
            name: "Google",
            icon: "/social-media/google.svg",
            onClick: () => console.log("Google login"),
        },
        {
            name: "Apple",
            icon: "/social-media/apple.svg",
            onClick: () => console.log("Apple login"),
        },
        {
            name: "LINE",
            icon: "/social-media/line.svg",
            onClick: () => console.log("LINE login"),
        },
    ];

    return (
        <div className="w-full max-w-[440px] mx-auto p-8 bg-white rounded-xl ">
            <div className="mb-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="อีเมล"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors"
                    required
                />
            </div>

            <div className="mb-2 relative">
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="รหัสผ่าน"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors pr-12"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    <img
                        src="/icon/hide.svg"
                        alt="toggle password"
                        className="w-5 h-5"
                    />
                </button>
            </div>

            {!isSignUp && (
                <div className="text-center mb-6">
                    <button
                        type="button"
                        className="text-sm text-button hover:text-primary transition-colors underline"
                    >
                        ลืมรหัสผ่าน
                    </button>
                </div>
            )}

            <div className="flex justify-center mb-6">
                <button className="btn-normal-active disable:btn-normal-inactive"> เข้าสู่ระบบ </button> 
            </div>

            <div className="text-center mb-6">
                <p className="text-sm text-text">หรือเข้าใช้งานด้วย</p>
            </div>

            <div className="flex gap-4 justify-center mb-6">
                {socialLogins.map((social) => (
                    <button
                        key={social.name}
                        onClick={social.onClick}
                        className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-all"
                    >
                        <img
                            src={social.icon}
                            alt={social.name}
                            className="w-10 h-10"
                        />
                    </button>
                ))}
            </div>

            <div className="text-center text-sm">
                <span className="text-text">
                    {isSignUp ? "เคยสมัครใช้งานแล้ว?" : "ยังไม่มีบัญชีใช้งาน?"}
                </span>
                <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="ml-1 text-text hover:underline font-medium"
                >
                    {isSignUp ? "เข้าสู่ระบบ" : "ลงทะเบียน"}
                </button>
            </div>
        </div>
    );
}