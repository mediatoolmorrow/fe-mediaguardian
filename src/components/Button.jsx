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
    normalActive: 
      "w-full sm:w-auto sm:min-w-[327px] sm:max-w-[400px] min-h-[48px] px-6 py-3 bg-primary text-white hover:bg-primary/80 font-bold",
    normalInactive: 
      "w-full sm:w-auto sm:min-w-[327px] sm:max-w-[400px] min-h-[48px] px-6 py-3 bg-button text-white font-bold",
    logoutButton: 
      "w-12 h-12 sm:w-auto sm:min-w-[180px] sm:max-w-[221px] sm:h-[50px] sm:px-6 bg-white text-primary border border-primary",
    loginButton: 
      "w-full sm:w-auto px-6 py-4 font-bold"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-full 
        flex items-center justify-center gap-2 sm:gap-5
        transition-all duration-200
        ${styles[variant]} 
        ${disabled ? "opacity-50 cursor-not-allowed" : ""} 
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {text && (
        <span className={`${hideTextOnMobile ? "hidden sm:inline" : ""} whitespace-nowrap`}>
          {text}
        </span>
      )}
    </button>
  );
}