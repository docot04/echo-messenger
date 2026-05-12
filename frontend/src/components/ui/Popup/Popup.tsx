import { type PopupProps } from "@/services";
import { FocusLayer } from "../FocusLayer/FocusLayer";
import { Typography } from "../Typography/Typography";

export const Popup = ({ open, onClose, title, children }: PopupProps) => {
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
