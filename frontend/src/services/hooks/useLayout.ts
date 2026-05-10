import { useEffect, useState } from "react";

function getMode() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspectRatio = width / height;

  // MobileView used if: width is small, phone in landscape
  const useMobileUI = width < 900 || aspectRatio < 1.25;

  return {
    isMobileUI: useMobileUI,
    isLandscape: width > height,
  };
}

export function useLayoutMode() {
  const [layout, setLayout] = useState(getMode());
  useEffect(() => {
    const onResize = () => {
      setLayout(getMode());
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return layout;
}
