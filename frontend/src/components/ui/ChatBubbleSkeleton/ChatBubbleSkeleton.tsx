import { type ChatBubbleSkeletonProps } from "@/services";
import { Skeleton } from "../Skeleton/Skeleton";
import { Spinner } from "../Spinner/Spinner";

export const ChatBubbleSkeleton = ({
  sent = false,
  width = "20%",
}: ChatBubbleSkeletonProps) => {
  return (
    <div className={`chatbubble-skeleton ${sent ? "sent" : "received"}`}>
      {!sent && <Spinner size="1rem" />}
      <div className={`bubble ${sent ? "sent" : "received"}`} style={{ width }}>
        <div className="content">
          <Skeleton
            height="0.9rem"
            width="100%"
            theme={sent ? "dark" : "light"}
          />
          <Skeleton
            height="0.9rem"
            width="65%"
            theme={sent ? "dark" : "light"}
          />
        </div>
      </div>
    </div>
  );
};
