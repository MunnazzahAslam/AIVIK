import { ReactNode } from "react";

interface ButtonProps {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  target?: string;
  rel?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export default function Button({
  href,
  children,
  variant = "primary",
  target,
  rel,
  type = "button",
  onClick,
  disabled,
  fullWidth = false,
  className = "",
}: ButtonProps) {
  const base = `inline-flex items-center justify-center font-body text-sm font-semibold px-5 py-[10px] transition-colors duration-200 cursor-pointer ${
    fullWidth ? "w-full" : ""
  }`;

  const variants = {
    primary: "aivik-btn-primary disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "bg-transparent border border-white text-white hover:bg-white hover:text-black",
  };

  const combined = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={combined}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combined}
    >
      {children}
    </button>
  );
}
