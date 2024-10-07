import { useRef } from "react";
import { useDrag } from "../hooks/useDrag";
import { Button, ColorPicker } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";

export default function UpdateColor({
  data,
  color,
  colors,
  setColor,
  handleSetColor,
  setShowPicker,
}) {
  const draggableRef = useRef(null);

  const { position, handleMouseDown } = useDrag({
    ref: draggableRef,
  });

  const handleCancel = () => {
    setColor(data?.color?.hex);
    setShowPicker(false);
  };

  const ref = useClickOutside(() => setShowPicker(false));

  return (
    <div ref={ref}>
      <div
        className="touch-none fixed top-[20%] left-[5%] z-[60] bg-white px-2 border-2 drop-shadow-sm"
        ref={draggableRef}
        style={{
          top: position.y,
          left: position.x,
        }}
      >
        <div
          className="h-5 bg-white touch-none"
          onMouseDown={handleMouseDown}
        />
        <ColorPicker
          color={data?.color?.hex}
          swatches={colors}
          onChange={setColor}
          classNames={{ wrapper: "!cursor-picker bg-white" }}
        />
        <div className="flex gap-2 justify-end mt-2">
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
        <div className="h-5 touch-none" onMouseDown={handleMouseDown} />
      </div>
    </div>
  );
}
