"use client";
import { useState } from "react";
import { FloatingIndicator, UnstyledButton } from "@mantine/core";

const ViewToggle = ({ active, setActive, data }) => {
  const [rootRef, setRootRef] = useState(null);
  const [controlsRefs, setControlsRefs] = useState({});

  const setControlRef = (index) => (node) => {
    controlsRefs[index] = node;
    setControlsRefs(controlsRefs);
  };

  const controls = data.map((item, index) => (
    <UnstyledButton
      key={item}
      className="!py-[6px] !px-[12px] rounded-md text-sm transition font-medium data-[active=true]:text-white hover:bg-bluegray-400"
      ref={setControlRef(index)}
      onClick={() => setActive(index)}
      mod={{ active: active === index }}
    >
      <span className="relative z-10">{item}</span>
    </UnstyledButton>
  ));

  return (
    <div
      className="relative w-fit rounded-md p-[5px] bg-bluegray-200 mb-5"
      ref={setRootRef}
    >
      {controls}

      <FloatingIndicator
        target={controlsRefs[active]}
        parent={rootRef}
        className="rounded-md bg-primary-700"
      />
    </div>
  );
};

export default ViewToggle;
