import { useEffect, useRef, useState, type ReactNode, useContext } from "react";
import { StackContext } from "../../../context";

type FocusLayerProps = {
  open: boolean;
  onClose: () => void;
  closable?: boolean;
  children: ReactNode;
};

export const FocusLayer = ({
  open,
  onClose,
  closable = true,
  children,
}: FocusLayerProps) => {
  const stack = useContext(StackContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);
  const idRef = useRef<number | null>(null);

  // mount/unmount with animation delay
  useEffect(() => {
    if (open) {
      setMounted(true);
      setVisible(false);

      setTimeout(() => setVisible(true), 0);
    } else {
      setVisible(false);
      setTimeout(() => setMounted(false), 200);
    }
  }, [open]);

  // stacking
  useEffect(() => {
    if (!stack || !open) return;
    idRef.current = stack.register();
    return () => stack.unregister();
  }, [open]);

  // ESC + focus trap
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closable && stack?.isTop(idRef.current!)) {
        onClose();
      }

      // basic focus trap (tab loop)
      if (e.key === "Tab") {
        const focusables = containerRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        if (!focusables || focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, closable, onClose, stack]);

  // lock scroll
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      className={`focus-layer ${visible ? "open" : ""}`}
      onMouseDown={(e) => {
        if (!closable) return;
        if (e.target === e.currentTarget && stack?.isTop(idRef.current!)) {
          onClose();
        }
      }}
    >
      <div ref={containerRef} className="focus-content">
        {children}
      </div>
    </div>
  );
};
