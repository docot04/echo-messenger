import React from "react";

type Props = {
  text: string;
  type?: "success" | "info" | "error";
};

export const Alert: React.FC<Props> = ({ text, type = "info" }) => {
  return (
    <div className={`alert ${type}`}>
      <p>{text}</p>
    </div>
  );
};
