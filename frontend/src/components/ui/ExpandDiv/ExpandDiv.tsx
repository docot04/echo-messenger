import React, { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  bar?: "solid" | "faded" | "none";
  body?: "solid" | "none";
  className?: string;
  innerClass?: string;
  stagger?: number;
  expandDuration?: number;
  revealDelay?: number;
};

export const ExpandDiv = ({
  children,
  scroll = false,
  bar = "solid",
  body = "solid",
  className = "",
  innerClass = "",
  stagger = 100,
  expandDuration = 300,
  revealDelay = 300,
}: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [visibleChildren, setVisibleChildren] = useState<boolean[]>([]);

  const childArray = React.Children.toArray(children);

  useEffect(() => {
    setVisibleChildren(Array(childArray.length).fill(false));

    // expand container
    setExpanded(true);

    // delay AFTER expansion finishes + extra pause
    const start = expandDuration + revealDelay;

    childArray.forEach((_, i) => {
      setTimeout(
        () => {
          setVisibleChildren((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        },
        start + i * stagger,
      );
    });
  }, []);

  return (
    <div
      className={`slide-root bar-${bar} body-${body} ${
        expanded ? "expanded" : ""
      } ${className}`}
      style={
        {
          "--expand-duration": `${expandDuration}ms`,
        } as React.CSSProperties
      }
    >
      <div className="slide-bars" />
      <div className={`slide-inner ${scroll ? "scroll" : ""} ${innerClass}`}>
        {childArray.map((child, i) => (
          <div
            key={i}
            className={`slide-child ${visibleChildren[i] ? "visible" : ""}`}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};
