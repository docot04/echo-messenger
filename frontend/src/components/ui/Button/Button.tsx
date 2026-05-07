import React, { type ButtonHTMLAttributes, type ReactNode } from "react";

type Props = {
  text?: string;
  box?: boolean;
  active?: "left" | "right" | "top" | "bottom" | "default" | "none";
  height?: string;
  width?: string;
  children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<Props> = ({
  text = "",
  type = "button",
  className = "",
  box = false,
  disabled = false,
  active = "none",
  height = "3rem",
  width = "10rem",
  children,
  onClick,
  ...props
}) => {
  const isActive = active !== "none";

  return (
    <button
      type={type}
      className={`btn ${className} 
        ${isActive ? `active active-${active}` : ""} 
        ${disabled ? "disabled" : ""}`}
      disabled={disabled}
      style={{ height, width }}
      onClick={onClick}
      {...props}
    >
      {box && <span className="btn-box" />}
      {children ?? text}
      <span className="bar top-bar" />
      <span className="bar bottom-bar" />
      <span className="btn-arrow" />
    </button>
  );
};
