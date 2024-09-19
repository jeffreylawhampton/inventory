"use client";
import { Button, ColorPicker } from "@mantine/core";
import Tooltip from "./Tooltip";
import { useRef } from "react";
import { useOutsideClick } from "rooks";

const UpdateColor = ({
  data,
  color,
  colors,
  setColor,
  handleSetColor,
  setShowPicker,
}) => {
  const ref = useRef();
  const handleCancel = () => {
    setColor(data?.color?.hex);
    setShowPicker(false);
  };

  useOutsideClick(ref, handleCancel);

  return (
    <div
      className="bg-white p-4 absolute top-[14%] z-50 drop-shadow-lg"
      ref={ref}
    >
      <ColorPicker
        color={data?.color?.hex}
        swatches={colors}
        onChange={setColor}
        classNames={{ wrapper: "!cursor-picker" }}
      />
      <div className="flex gap-2 justify-end mt-5">
        <Button variant="subtle" color="danger" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={handleSetColor}
          variant="subtle"
          disabled={data?.color === color}
        >
          Set color
        </Button>
      </div>
    </div>
  );
};

export default UpdateColor;
