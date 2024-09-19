"use client";
import { useState } from "react";
import { FloatingIndicator, UnstyledButton } from "@mantine/core";
import classes from "./index.module.css";

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
      className={classes.control}
      ref={setControlRef(index)}
      onClick={() => setActive(index)}
      mod={{ active: active === index }}
    >
      <span className={classes.controlLabel}>{item}</span>
    </UnstyledButton>
  ));

  return (
    <div className={classes.root} ref={setRootRef}>
      {controls}

      <FloatingIndicator
        target={controlsRefs[active]}
        parent={rootRef}
        className={classes.indicator}
      />
    </div>
  );
};

export default ViewToggle;
