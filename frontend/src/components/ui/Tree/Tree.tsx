import { useRef, useState, useEffect } from "react";
import { ExpandDiv } from "../ExpandDiv/ExpandDiv";
import { Button } from "../Button/Button";
import { ButtonExtended } from "../ButtonExtended/ButtonExtended";

type Level2 = {
  title: string;
  subtitle: string;
  onClick: () => void;
};

type Level1 = {
  text: string;
  children: Level2[];
};

type Props = {
  data: Level1[];
};

export const Tree = ({ data }: Props) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [heights, setHeights] = useState<Record<number, number>>({});
  const refs = useRef<Record<number, HTMLDivElement | null>>({});

  const ANIM = 250;

  const handleClick = (i: number) => {
    setActiveIndex((prev) => (prev === i ? null : i));
  };

  // measure heights dynamically
  useEffect(() => {
    const newHeights: Record<number, number> = {};

    Object.keys(refs.current).forEach((key) => {
      const el = refs.current[Number(key)];
      if (el) newHeights[Number(key)] = el.scrollHeight;
    });

    setHeights(newHeights);
  }, [activeIndex, data]);

  return (
    <ExpandDiv bar="faded" body="none" className="tree-root" scroll>
      {data.map((lvl1, i) => {
        const isOpen = activeIndex === i;

        return (
          <div key={i} className="tree-node">
            <Button
              box
              text={lvl1.text}
              active={isOpen ? "right" : "none"}
              onClick={() => handleClick(i)}
              height="2rem"
              width="calc(100% - 3rem)"
            />

            <div
              className="tree-level2-wrapper"
              style={{
                height: isOpen ? heights[i] || 0 : 0,
                overflow: "hidden",
                transition: `height ${ANIM}ms ease`,
              }}
            >
              <div
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="tree-level2-inner"
              >
                {isOpen && (
                  <ExpandDiv bar="faded" body="none" className="tree-children">
                    {lvl1.children.map((lvl2, j) => (
                      <ButtonExtended
                        key={j}
                        title={lvl2.title}
                        subtitle={lvl2.subtitle}
                        onClick={lvl2.onClick}
                        height="4rem"
                        width="calc(100% - 5rem)"
                      />
                    ))}
                  </ExpandDiv>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </ExpandDiv>
  );
};
