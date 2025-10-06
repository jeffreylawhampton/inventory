import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Spoiler } from "@mantine/core";

function useOverflow(maxHeight, deps = []) {
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

  return { contentRef: ref, hasOverflow };
}

export default function RevealSection({
  title,
  maxHeight = 65,
  children,
  deps = [],
  PillComponent = "button",
  pillProps = {},
  expanded,
  onToggle,
  defaultExpanded = false,
  classNames = {},
}) {
  const isControlled =
    typeof expanded === "boolean" && typeof onToggle === "function";
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

  const isOpen = isControlled ? expanded : internalExpanded;
  const toggle = () => {
    if (isControlled) onToggle(!expanded);
    else setInternalExpanded((v) => !v);
  };

  const { contentRef, hasOverflow } = useOverflow(maxHeight, deps);

  return (
    <div className={classNames.wrapper}>
      <div
        className={`flex w-full justify-between items-center mb-2 mt-6 ${
          classNames.header || ""
        }`}
      >
        {title ? (
          <h2 className={`font-medium text-sm ${classNames.title || ""}`}>
            {title}
          </h2>
        ) : (
          <div />
        )}
        {hasOverflow ? (
          <PillComponent onClick={toggle} {...pillProps}>
            {isOpen ? "Collapse" : "Show all"}
          </PillComponent>
        ) : null}
      </div>

      <Spoiler
        maxHeight={maxHeight}
        showLabel="Show all"
        hideLabel="Collapse"
        expanded={isOpen}
        setExpanded={isControlled ? onToggle : setInternalExpanded}
        classNames={{
          control: "!hidden",
          root: classNames.spoilerRoot || "!mb-0",
        }}
      >
        <div ref={contentRef}>{children}</div>
      </Spoiler>
    </div>
  );
}
