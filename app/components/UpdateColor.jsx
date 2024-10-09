import Draggable, { DraggableCore } from "react-draggable";
import { Button, ColorPicker } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";

function UpdateColor({
  data,
  color,
  colors,
  setColor,
  handleSetColor,
  setShowPicker,
}) {
  const handleCancel = () => {
    setColor(data?.color?.hex);
    setShowPicker(false);
  };

  return (
    <Draggable handle=".handle">
      <div className="bg-white border-2 px-2 z-[60] absolute top-[15%]">
        <div className="handle h-12 w-full bg-bluegray-300 border-y-8 border-white" />
        <ColorPicker
          color={data?.color?.hex}
          defaultValue={data?.color?.hex}
          swatches={colors}
          onChange={setColor}
          classNames={{ wrapper: "!cursor-picker " }}
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
        <div className="handle h-12 w-full bg-bluegray-300 border-y-8 border-white" />
      </div>
    </Draggable>
  );
}

export default UpdateColor;
