import React, { useEffect, useRef } from "react";
import { Button } from "../Button/Button";

type DropdownItem = {
  title: string;
  callback: () => void;
};

type Props = {
  open: boolean;
  width?: string;
  arrow?: "left" | "right" | "none";
  items: DropdownItem[];
  className?: string;
  onClose?: () => void;
};

export const Dropdown: React.FC<Props> = ({
  width = "11rem",
  arrow = "right",
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
          <Button
            arrow={arrow}
            height="2rem"
            width={`calc(${width} - 1rem)`}
            bars={false}
            key={index}
            text={item.title}
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
