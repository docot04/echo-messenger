import { type SkeletonProps } from "@/services";

export function Skeleton({
  width = "100%",
  height = 20,
  theme = "light",
}: SkeletonProps) {
  return (
    <div
      className={`skeleton ${theme}`}
      style={{
        width,
        height,
      }}
    />
  );
}
