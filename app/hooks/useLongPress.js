import { useRef } from "react";

export function useLongPress(callback, ms = 500) {
  const timeout = useRef();

  const start = (e) => {
    timeout.current = setTimeout(() => callback(e), ms);
  };

  const clear = () => {
    clearTimeout(timeout.current);
  };

  return {
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchCancel: clear,
  };
}
