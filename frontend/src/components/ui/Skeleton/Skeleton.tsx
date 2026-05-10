type Props = {
  width?: number | string;
  height?: number | string;
  theme?: "light" | "dark";
};

export function Skeleton({
  width = "100%",
  height = 20,
  theme = "light",
}: Props) {
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
