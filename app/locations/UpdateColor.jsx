import { useState } from "react";
import { useUserColors } from "../hooks/useUserColors";
import { mutate } from "swr";
import Draggable from "react-draggable";
import { Button, ColorPicker, ColorSwatch } from "@mantine/core";
import { Tooltip } from "../components";
import toast from "react-hot-toast";
import { updateContainerColor } from "../containers/api/db";

function UpdateColor({ data, mutateKey }) {
  const [showPicker, setShowPicker] = useState(false);
  const [color, setColor] = useState(data?.color?.hex || "#ffffff");
  const { colors } = useUserColors();
  const handleCancel = () => {
    setColor(data?.color?.hex);
    setShowPicker(false);
  };

  const handleSetColor = async () => {
    if (data?.color?.hex == color) return setShowPicker(false);

    try {
      await mutate(
        mutateKey,
        updateContainerColor({
          id: data.id,
          color,
          userId: data.userId,
        }),
        {
          optimisticData: { ...data, color: { hex: color } },
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      mutate("/locations/api");
      toast.success("Color updated");
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
    setShowPicker(false);
  };

  return (
    <>
      <Tooltip
        label="Update color"
        textClasses={showPicker ? "hidden" : "!text-black font-medium"}
      >
        <ColorSwatch
          color={data?.color?.hex}
          size={22}
          onClick={() => setShowPicker(!showPicker)}
          className="cursor-pointer"
        />
      </Tooltip>

      {showPicker ? (
        <Draggable handle=".handle">
          <div className="bg-white border-2 px-2 z-[60] absolute top-[15%]">
            <div className="handle h-10 lg:h-5 w-full bg-bluegray-100 border-y-8 border-white" />
            <ColorPicker
              color={data?.color?.hex}
              defaultValue={data?.color?.hex}
              swatches={colors}
              onChange={setColor}
              classNames={{
                wrapper: "!cursor-picker ",
                swatches: "max-h-[160px] lg:max-h-[220px] overflow-y-auto",
              }}
            />
            <div className="flex gap-2 justify-end mt-2">
              <Button variant="subtle" color="danger" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                color="primary"
                onClick={handleSetColor}
                variant="subtle"
                disabled={data?.color?.hex === color}
              >
                Set color
              </Button>
            </div>
            <div className="handle h-10 lg:h-5 w-full bg-bluegray-100 border-y-8 border-white" />
          </div>
        </Draggable>
      ) : null}
    </>
  );
}

export default UpdateColor;
