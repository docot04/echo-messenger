import { type ReactNode } from "react";
import { FocusLayer } from "../FocusLayer/FocusLayer";
import { Typography } from "../Typography/Typography";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export const Popup = ({ open, onClose, title, children }: Props) => {
  return (
    <FocusLayer open={open} onClose={onClose}>
      <div className="popup">
        <div className="popup-top">
          {title && <Typography text={title} className="popup-title" reveal />}
          <button className="popup-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="popup-content">{children}</div>
      </div>
    </FocusLayer>
  );
};
