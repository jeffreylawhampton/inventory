import Draggable from "react-draggable";
import { Button, ColorPicker } from "@mantine/core";

const ColorInput = ({
  color,
  colors,
  handleSetColor,
  setShowPicker,
  handleCancel,
}) => {
  return (
    <Draggable handle=".handle">
      <div className="bg-white border-2 px-2 fixed top-[15%] z-[1001] rounded-lg">
        <div className="handle h-10 w-full bg-bluegray-100 border-y-8 border-white" />
        <ColorPicker
          color={color}
          defaultValue={color}
          swatches={colors}
          onChange={handleSetColor}
          classNames={{ wrapper: "!cursor-picker " }}
        />
        <div className="flex gap-2 justify-end mt-2">
          <Button variant="subtle" color="danger" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() => setShowPicker(false)}
            variant="subtle"
          >
            Set color
          </Button>
        </div>
        <div className="handle h-10 w-full bg-bluegray-100 border-y-8 border-white " />
      </div>
    </Draggable>
  );
};

export default ColorInput;
