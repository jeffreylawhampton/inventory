import { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function useOverflow(maxHeight, deps = []) {
  const ref = useRef(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  const check = () => {
    const el = ref.current;
    if (!el) return;

    setHasOverflow(el.scrollHeight > maxHeight);
  };

  useLayoutEffect(check, deps);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver(check);
    ro.observe(el);
    window.addEventListener("resize", check);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", check);
    };
  }, deps);

  return { ref, hasOverflow };
}
