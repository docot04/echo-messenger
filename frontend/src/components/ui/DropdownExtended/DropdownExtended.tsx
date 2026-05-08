import React, { useEffect, useRef } from "react";
import { ButtonExtended } from "../ButtonExtended/ButtonExtended";

type DropdownItem = {
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
};

export const DropdownExtended: React.FC<Props> = ({
  width = "12rem",
  open,
  items,
  className = "",
  onClose,
}) => {
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

  return (
    <div ref={ref} className={`dropdown ${className}`} style={{ width }}>
      <div className="dropdown-items">
        {items.map((item, index) => (
          <ButtonExtended
            contextHighlight
            arrow="right"
            width={width}
            bars={false}
            key={index}
            title={item.title}
            icon={item.icon}
            context2={item.context}
            onClick={() => {
              item.callback();
              onClose?.();
            }}
          />
        ))}
      </div>
    </div>
  );
};
