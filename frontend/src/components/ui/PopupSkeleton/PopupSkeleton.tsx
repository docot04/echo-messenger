import { type PopupSkeletonProps } from "@/services";
import { Popup } from "../Popup/Popup";
import { Spinner } from "../Spinner/Spinner";
import { useLanguage } from "@/context";

export const PopupSkeleton = ({
  height,
  width = "22rem",
  open,
  onClose,
}: PopupSkeletonProps) => {
  const { t } = useLanguage();
  return (
    <Popup open={open} onClose={onClose} title={t("common.loading")}>
      <div className="popup-skeleton" style={{ height, width }}>
        <Spinner size="3rem" />
      </div>
    </Popup>
  );
};
