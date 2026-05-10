type Props = {
  size?: string;
};

export function Spinner({ size = "1rem" }: Props) {
  return <div className="spinner" style={{ width: size, height: size }} />;
}
