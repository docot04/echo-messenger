import { Spinner } from "../Spinner/Spinner";
import { Skeleton } from "../Skeleton/Skeleton";

type Props = { height?: string; width?: string; icon?: boolean };
export const ButtonExtendedSkeleton = ({
  height = "3rem",
  width = "10rem",
  icon = false,
}: Props) => {
  return (
    <div className="button-extended-skeleton" style={{ height, width }}>
      <div className="button-extended-skeleton-content">
        {icon && (
          <div className="button-extended-skeleton-spinner">
            <Spinner size="1rem" />
          </div>
        )}
        <Skeleton width="100%" height="0.7rem" />
      </div>
    </div>
  );
};
