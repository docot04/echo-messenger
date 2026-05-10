import { Popup } from "../Popup/Popup";
import { Spinner } from "../Spinner/Spinner";
import { useLanguage } from "@/context";

type Props = {
  height?: string;
  width?: string;
  open: boolean;
  onClose: () => void;
};

export const PopupSkeleton = ({
  height,
  width = "32rem",
  open,
  onClose,
}: Props) => {
  const { t } = useLanguage();
  return (
    <Popup open={open} onClose={onClose} title={t("common.loading")}>
      <div className="popup-skeleton" style={{ height, width }}>
        <Spinner size="3rem" />
      </div>
    </Popup>
  );
};
