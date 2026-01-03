import React from "react";

export default function Button({
  text,
  onClick,
  icon,
  variant = "",
  disabled = false,
  className = "",
  hideTextOnMobile = false,
}) {
  const styles = {
    normalActive: "px-6 py-4 bg-primary text-white hover:bg-primary/80 font-bold max-w-[400px] max-h-[48px] min-h-[28px] min-w-[327px]",
    normalInactive: "px-6 py-4  bg-button text-white font-bold",
    logoutButton: "sm:px-6 sm:py-4  bg-white text-primary border border-primary min-w-[50px] min-h-[50px] max-w-[221px] max-h-[50px] rounded-full sm:rounded-full",
    loginButton: "px-6 py-4 font-bold" 
};

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full flex items-center justify-center gap-5 transition ${styles[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {text && (
        <span className={hideTextOnMobile ? "hidden md:inline" : ""}>
          {text}
        </span>
      )}
            {icon}
    </button>
  );
}