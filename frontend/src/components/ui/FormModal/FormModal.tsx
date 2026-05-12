import { useEffect, useState } from "react";
import { type FormModalProps } from "@/services";
import { Popup } from "../Popup/Popup";
import { Button } from "../Button/Button";
import { useLanguage } from "@/context";

export const FormModal = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  onConfirm,
}: FormModalProps) => {
  const { t } = useLanguage();
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
        <div className="formmodal-buttons">
          <Button
            text={t("common.confirm")}
            width="14rem"
            onClick={onConfirm}
          />
          <Button
            text={t("common.cancel")}
            width="14rem"
            onClick={handleCancel}
          />
        </div>
      </div>
    </Popup>
  );
};
