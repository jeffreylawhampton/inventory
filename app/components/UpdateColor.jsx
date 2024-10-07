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
  const ref = useClickOutside(() => setShowPicker(false));
  const eventHandler = (e, data) => {
    console.log("Event Type", e.type);
    console.log({ e, data });
  };

  const handleCancel = () => {
    setColor(data?.color?.hex);
    setShowPicker(false);
  };

  return (
    <Draggable onDrag={eventHandler} handle=".handle">
      <div className="bg-white border-2 px-3 z-[60] absolute top-[15%]">
        <div className="handle h-6 w-full" />
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
        <div className="handle h-6 w-full" />
      </div>
    </Draggable>
  );
}

export default UpdateColor;
