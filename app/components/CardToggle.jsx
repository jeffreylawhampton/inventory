"use client";
import { useState, useContext } from "react";
import { FloatingIndicator, UnstyledButton } from "@mantine/core";
import { Image, SquareGanttChart } from "lucide-react";
import { DeviceContext } from "../providers";

const CardToggle = () => {
  const { view, setView } = useContext(DeviceContext);
  const [rootRef, setRootRef] = useState(null);
  const [controlsRefs, setControlsRefs] = useState({});

  const data = [
    {
      key: "thumbnail",
      component: <Image size={22} aria-label="Thumbnail view" />,
    },
    {
      key: "card",
      component: <SquareGanttChart size={22} aria-label="Card view" />,
    },
  ];

  const setControlRef = (index) => (node) => {
    controlsRefs[index] = node;
    setControlsRefs(controlsRefs);
  };

  const controls = data.map((item, index) => {
    return (
      <UnstyledButton
        key={item.key}
        className="!py-[4px] !px-[10px] rounded-md text-sm transition font-medium data-[active=true]:text-white hover:bg-primary-200/70"
        ref={setControlRef(index)}
        onClick={() => setView(index)}
        mod={{ active: view === index }}
      >
        <span className="relative z-10 capitalize">{item.component}</span>
      </UnstyledButton>
    );
  });

  return (
    <div
      className={`relative w-fit rounded-md p-1 flex items-center bg-bluegray-200/80 `}
      ref={setRootRef}
    >
      {controls}

      <FloatingIndicator
        target={controlsRefs[view]}
        parent={rootRef}
        className="rounded-md bg-black"
      />
    </div>
  );
};

export default CardToggle;
