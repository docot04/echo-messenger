import { useEffect, useRef, useState } from "react";

const chars = ["X", "&", "R", "Y", "G", "7", "5", "S", "F", "4", "J", ">"];

type Props = {
  text?: string;

  // behavior
  reveal?: boolean;
  glitch?: boolean;
  flicker?: boolean;

  // tuning
  speed?: number;
  shuffle?: number;

  // styling
  className?: string;
  mono?: boolean;
  bordered?: boolean;
  shadow?: boolean;
};

export const Typography = ({
  text = "",
  reveal = false,
  glitch = false,
  flicker = false,
  speed = 30,
  shuffle = 3,
  className = "",
  mono = false,
  bordered = false,
  shadow = false,
}: Props) => {
  const [display, setDisplay] = useState("");

  const containerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const isVisibleRef = useRef(true);

  const textArr = useRef<string[]>([]);
  const outputArr = useRef<string[]>([]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!text) return;

    const upper = text.toUpperCase();
    textArr.current = upper.split("");
    outputArr.current = Array(upper.length).fill("");

    let index = 0;
    let shuffleCount = 0;
    let glitchTimer = 0;

    let active = true;

    // initial state
    if (!reveal) {
      outputArr.current = [...textArr.current];
      setDisplay(upper);
    }

    const loop = (time: number) => {
      if (!active) return;

      // skip work if not visible
      if (!isVisibleRef.current) {
        frameRef.current = requestAnimationFrame(loop);
        return;
      }

      // throttle
      if (time - lastTimeRef.current < speed) {
        frameRef.current = requestAnimationFrame(loop);
        return;
      }

      lastTimeRef.current = time;

      if (reveal && index < textArr.current.length) {
        if (shuffleCount < shuffle) {
          outputArr.current[index] =
            chars[Math.floor(Math.random() * chars.length)];
          shuffleCount++;
        } else {
          outputArr.current[index] = textArr.current[index];
          index++;
          shuffleCount = 0;
        }
      }

      if (glitch) {
        glitchTimer += speed;

        if (glitchTimer > 500 + Math.random() * 1000) {
          glitchTimer = 0;

          const i = Math.floor(Math.random() * textArr.current.length);

          const original = textArr.current[i];

          outputArr.current[i] =
            chars[Math.floor(Math.random() * chars.length)];

          setTimeout(() => {
            outputArr.current[i] = original;
          }, 80);
        }
      }

      const next = outputArr.current.join("");

      // avoid unnecessary renders
      setDisplay((prev) => (prev === next ? prev : next));

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      active = false;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [text, reveal, glitch, speed, shuffle]);

  return (
    <div
      ref={containerRef}
      className={[
        "typography",
        flicker && "flicker",
        mono && "mono",
        bordered && "bordered",
        shadow && "shadow",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {display}
    </div>
  );
};
