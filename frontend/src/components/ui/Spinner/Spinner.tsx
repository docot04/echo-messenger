import { type SpinnerProps } from "@/services";
export function Spinner({ size = "1rem" }: SpinnerProps) {
  return <div className="spinner" style={{ width: size, height: size }} />;
}
