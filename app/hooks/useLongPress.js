import { useRef } from "react";

export function useLongPress(onTouchBegin, ms = 500, onTouchEnd) {
  const timeout = useRef();

  const start = (e) => {
    timeout.current = setTimeout(() => onTouchBegin(e), ms);
  };

  const clear = () => {
    clearTimeout(timeout.current);
    onTouchEnd();
  };

  return {
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchCancel: clear,
  };
}
