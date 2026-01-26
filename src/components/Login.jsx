import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
    const navigate = useNavigate();

    const {
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInWithFacebook,
        signInWithApple,
        signInWithLine,
        resetPassword,
        error,
        successMessage,
        clearError,
        clearSuccessMessage,
        backendUser,
        loading
    } = useAuth();

    // Navigate when user is authenticated
    useEffect(() => {
        if (backendUser && !loading) {
            // Check if user needs to complete first-time survey
            if (backendUser.isFirstTime) {
                navigate("/survey/1");
            } else {
                navigate("/tutorial");
            }
        }
    }, [backendUser, loading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let result;
            if (isSignUp) {
                result = await signUpWithEmail(email, password);
            } else {
                result = await signInWithEmail(email, password);
            }

            if (result.success) {
                // Navigation is handled by useEffect
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await signInWithGoogle();
        } finally {
            setIsLoading(false);
        }
    };

    const handleFacebookLogin = async () => {
        setIsLoading(true);
        try {
            await signInWithFacebook();
        } finally {
            setIsLoading(false);
        }
    };

    const handleAppleLogin = async () => {
        setIsLoading(true);
        try {
            await signInWithApple();
        } finally {
            setIsLoading(false);
        }
    };

    const handleLineLogin = () => {
        // LINE login redirects to LINE's OAuth page
        signInWithLine();
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!forgotPasswordEmail) return;

        setIsLoading(true);
        try {
            const result = await resetPassword(forgotPasswordEmail);
            if (result.success) {
                setForgotPasswordEmail("");
                // Keep modal open to show success message
            }
        } finally {
            setIsLoading(false);
        }
    };

    const openForgotPasswordModal = () => {
        setForgotPasswordEmail(email); // Pre-fill with email from login form
        setShowForgotPassword(true);
        clearError();
        clearSuccessMessage();
    };

    const closeForgotPasswordModal = () => {
        setShowForgotPassword(false);
        setForgotPasswordEmail("");
        clearError();
        clearSuccessMessage();
    };

    const socialLogins = [
        {
            name: "Facebook",
            icon: "/social-media/facebook.svg",
            onClick: handleFacebookLogin,
        },
        {
            name: "Google",
            icon: "/social-media/google.svg",
            onClick: handleGoogleLogin,
        },
        {
            name: "Apple",
            icon: "/social-media/apple.svg",
            onClick: handleAppleLogin,
        },
        {
            name: "LINE",
            icon: "/social-media/line.svg",
            onClick: handleLineLogin,
        },
    ];

    // Show loading while checking auth state
    if (loading) {
        return (
            <div className="w-full max-w-[440px] mx-auto p-8 bg-white rounded-xl flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[440px] mx-auto p-8 bg-white rounded-xl">
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
                    <span className="text-sm">{error}</span>
                    <button
                        onClick={clearError}
                        className="text-red-700 hover:text-red-900"
                    >
                        &times;
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="อีเมล"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors"
                        required
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                            onClick={openForgotPasswordModal}
                            className="text-sm text-button hover:text-primary transition-colors underline"
                        >
                            ลืมรหัสผ่าน
                        </button>
                    </div>
                )}

                <div className="flex justify-center mb-6">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-normal-active disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                กำลังดำเนินการ...
                            </span>
                        ) : (
                            isSignUp ? "ลงทะเบียน" : "เข้าสู่ระบบ"
                        )}
                    </button>
                </div>
            </form>

            <div className="text-center mb-6">
                <p className="text-sm text-text">หรือเข้าใช้งานด้วย</p>
            </div>

            <div className="flex gap-4 justify-center mb-6">
                {socialLogins.map((social) => (
                    <button
                        key={social.name}
                        onClick={social.onClick}
                        disabled={isLoading}
                        className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                    disabled={isLoading}
                    className="ml-1 text-text hover:underline font-medium disabled:opacity-50"
                >
                    {isSignUp ? "เข้าสู่ระบบ" : "ลงทะเบียน"}
                </button>
            </div>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-[400px] mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">ลืมรหัสผ่าน</h2>
                            <button
                                onClick={closeForgotPasswordModal}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">
                            กรอกอีเมลของคุณ เราจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปให้
                        </p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {successMessage && (
                            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                                {successMessage}
                            </div>
                        )}

                        <form onSubmit={handleForgotPassword}>
                            <input
                                type="email"
                                value={forgotPasswordEmail}
                                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                placeholder="อีเมล"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors mb-4"
                                required
                                disabled={isLoading}
                            />

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={closeForgotPasswordModal}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 btn-normal-active disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                        </span>
                                    ) : (
                                        "ส่งลิงก์"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
