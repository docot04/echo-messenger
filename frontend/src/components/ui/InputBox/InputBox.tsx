import React, { type InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  width?: string;
  label?: string;
  error?: string;
  border?: boolean;
};

export const InputBox: React.FC<Props> = ({
  width = "16rem",
  label,
  error,
  border = false,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`inputbox ${error ? "error" : ""} ${border ? "border" : ""} ${className}`}
      style={{ width }}
    >
      <div className="top">
        {label && <p>{label}</p>}
        {error && <p className="tooltip">{error}</p>}
      </div>

      <input {...props} />
    </div>
  );
};
