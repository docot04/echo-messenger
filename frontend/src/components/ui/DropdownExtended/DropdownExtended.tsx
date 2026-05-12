import { useEffect, useRef } from "react";
import { ButtonExtended } from "../ButtonExtended/ButtonExtended";
import { ButtonExtendedSkeleton } from "../ButtonExtendedSkeleton/ButtonExtendedSkeleton";

type DropdownItem = {
  id: string;
  title: string;
  icon?: string;
  context?: string;
  callback: () => void;
};

type Props = {
  open: boolean;
  width?: string;
  items: DropdownItem[];
  className?: string;
  onClose?: () => void;
  loading?: boolean;
  loadingCount?: number;
  emptyText?: string;
};

export const DropdownExtended = ({
  width = "100%",
  open,
  items,
  className = "",
  onClose,
  loading = false,
  loadingCount = 3,
  emptyText,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!open) return null;
  const isEmpty = !loading && items.length === 0;

  return (
    <div ref={ref} className={`dropdown ${className}`}>
      <div className="dropdown-items">
        {loading &&
          Array.from({ length: loadingCount }, (_, i) => (
            <ButtonExtendedSkeleton key={i} width={width} icon />
          ))}
        {!loading &&
          items.map((item) => (
            <ButtonExtended
              contextHighlight
              arrow="none"
              width={width}
              bars={false}
              key={item.id}
              title={item.title}
              icon={item.icon}
              context2={item.context}
              onClick={() => {
                item.callback();
                onClose?.();
              }}
            />
          ))}
        {isEmpty && emptyText && (
          <div className="dropdown-extended-empty">{emptyText}</div>
        )}
      </div>
    </div>
  );
};
