import { FocusLayer } from "../FocusLayer/FocusLayer";
import { Typography } from "../Typography/Typography";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  closable?: boolean;
  side?: "left" | "right";
  children: React.ReactNode;
};

export const Drawer = ({
  open,
  onClose,
  title,
  closable = true,
  side = "right",
  children,
}: Props) => {
  return (
    <FocusLayer open={open} onClose={onClose} closable={closable}>
      <div className={`drawer ${side}`}>
        <div className="drawer-header">
          <Typography reveal className="drawer-title" text={title} />
          <button onClick={onClose}>✕</button>
        </div>
        <div className="drawer-body">{children}</div>
      </div>
    </FocusLayer>
  );
};
