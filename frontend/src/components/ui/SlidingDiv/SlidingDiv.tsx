import { type SlidingDivProps } from "@/services";

export const SlidingDiv = ({
  children,
  className = "",
  direction = "left",
}: SlidingDivProps) => {
  return (
    <div className={`slidingdiv slide-${direction} ${className}`}>
      {children}
    </div>
  );
};
