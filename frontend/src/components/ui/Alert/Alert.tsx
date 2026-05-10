type Props = {
  text: string;
  type?: "success" | "info" | "error";
};

export const Alert = ({ text, type = "info" }: Props) => {
  return (
    <div className={`alert ${type}`}>
      <p>{text}</p>
    </div>
  );
};
