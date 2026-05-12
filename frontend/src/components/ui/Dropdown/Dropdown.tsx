import { useEffect, useRef } from "react";
import { type DropdownProps } from "@/services";
import { Button } from "../Button/Button";

export const Dropdown = ({
  width = "11rem",
  arrow = "right",
  open,
  items,
  className = "",
  onClose,
}: DropdownProps) => {
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
