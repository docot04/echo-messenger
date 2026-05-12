import { type InputBoxProps } from "@/services";

export const InputBox = ({
  width = "16rem",
  label,
  error,
  border = false,
  className = "",
  ...props
}: InputBoxProps) => {
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
