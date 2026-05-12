import { type ButtonProps } from "@/services";

export const Button = ({
  text = "",
  type = "button",
  className = "",
  box = false,
  arrow = "left",
  bars = true,
  disabled = false,
  active = "none",
  height = "3rem",
  width = "10rem",
  children,
  onClick,
  ...props
}: ButtonProps) => {
  const isActive = active !== "none";
  const hasArrow = arrow !== "none";

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
      {bars && <span className="bar top-bar" />}
      {bars && <span className="bar bottom-bar" />}
      {hasArrow && <span className={`btn-arrow ${arrow}`} />}
    </button>
  );
};
