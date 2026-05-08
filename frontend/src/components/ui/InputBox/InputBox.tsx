import React, { type InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  width?: string;
  label?: string;
  error?: string;
};

export const InputBox: React.FC<Props> = ({
  width = "16rem",
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`inputbox ${error ? "error" : ""} ${className}`}
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
