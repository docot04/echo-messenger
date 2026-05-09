import React, { useEffect, useState, type ReactNode } from "react";

import { Popup } from "../Popup/Popup";
import { Button } from "../Button/Button";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  onConfirm?: () => void;
};

export const FormModal: React.FC<Props> = ({
  open,
  onClose,
  title,
  subtitle,
  children,

  onConfirm,
}) => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!open) {
      setKey((prev) => prev + 1);
    }
  }, [open]);

  const handleCancel = () => {
    setKey((prev) => prev + 1);
    onClose();
  };

  return (
    <Popup open={open} onClose={handleCancel} title={title}>
      <div className="formmodal" key={key}>
        {subtitle && <p className="subtitle">{subtitle}</p>}
        <div className="form-content">{children}</div>
        <div className="buttons">
          <Button text="Confirm" width="14rem" onClick={onConfirm} />
          <Button text="Cancel" width="14rem" onClick={handleCancel} />
        </div>
      </div>
    </Popup>
  );
};
