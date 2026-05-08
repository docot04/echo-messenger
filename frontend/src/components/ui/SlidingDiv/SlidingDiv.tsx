import type React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  direction: "left" | "right" | "up" | "down";
};

export const SlidingDiv = ({
  children,
  className = "",
  direction = "left",
}: Props) => {
  return (
    <div className={`slidingdiv slide-${direction} ${className}`}>
      {children}
    </div>
  );
};
