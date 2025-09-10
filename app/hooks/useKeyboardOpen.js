import { useEffect, useState } from "react";

export function useKeyboardOpen() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const viewport = window.visualViewport;

    if (!viewport) return;

    const handler = () => {
      const heightDiff = window.innerHeight - viewport.height;
      setIsKeyboardOpen(heightDiff > 150);
    };

    viewport.addEventListener("resize", handler);
    return () => viewport.removeEventListener("resize", handler);
  }, []);

  return isKeyboardOpen;
}
