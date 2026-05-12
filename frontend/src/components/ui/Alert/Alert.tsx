import { type AlertProp } from "@/services";

export const Alert = ({ text, type = "info" }: AlertProp) => {
  return (
    <div className={`alert ${type}`}>
      <p>{text}</p>
    </div>
  );
};
