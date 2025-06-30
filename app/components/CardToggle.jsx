"use client";
import { useState, useContext } from "react";
import { FloatingIndicator, UnstyledButton } from "@mantine/core";
import { Image, SquareGanttChart } from "lucide-react";
import { DeviceContext } from "../providers";

const CardToggle = () => {
  const { view, setView } = useContext(DeviceContext);
  const [rootRef, setRootRef] = useState(null);
  const [controlsRefs, setControlsRefs] = useState({});

  const setControlRef = (index) => (node) => {
    controlsRefs[index] = node;
    setControlsRefs(controlsRefs);
  };

  return (
    <div
      className={`relative w-fit rounded-md px-1 py-0.5 flex items-center justify-center bg-bluegray-200`}
      ref={setRootRef}
    >
      <UnstyledButton
        className="!py-[4px] !px-[10px] rounded-md transition hover:bg-primary-200/70"
        ref={setControlRef(0)}
        onClick={() => setView(0)}
        mod={{ active: !view }}
      >
        <span className="relative z-10">
          <Image
            size={22}
            stroke={!view ? "white" : "black"}
            data-active={!view}
            aria-label="Thumbnail view"
            className="relative z-30"
          />
        </span>
      </UnstyledButton>

      <UnstyledButton
        className={
          "!py-[4px] !px-[10px] rounded-md transition relative hover:bg-primary-200/70"
        }
        ref={setControlRef(1)}
        onClick={() => setView(1)}
        mod={{ active: view }}
      >
        <span className="relative z-10">
          <SquareGanttChart
            aria-label="Card view"
            className={"z-20 relative"}
            data-active={view}
            stroke={view ? "white" : "black"}
            size={20}
          />
        </span>
      </UnstyledButton>
      <FloatingIndicator
        target={controlsRefs[view]}
        parent={rootRef}
        className="rounded-md bg-black"
      />
    </div>
  );
};

export default CardToggle;
