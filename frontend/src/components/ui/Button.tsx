import React from "react";

type ButtonProps = {
  type?: "button" | "submit";
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "custom";
  className?: string; 
};

const Button: React.FC<ButtonProps> = ({
  type = "button",
  children,
  variant = "primary",
  className = "",
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md text-m font-medium transition-all h-10 px-4 py-2 min-w-[160px]";

  const variants = {
    primary: "bg-white text-black hover:bg-black hover:text-white hover:ring hover:ring-white",
    secondary: "hover:bg-accent hover:ring hover:ring-white",
    custom: "", 
  };

  return (
    <button
      type={type}
      className={`${variant !== "custom" ? `${baseClasses} ${variants[variant]}` : ""} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
