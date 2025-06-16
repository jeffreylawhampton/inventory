import { useState } from "react";
import { useUserColors } from "../hooks/useUserColors";
import { mutate } from "swr";
import Draggable from "react-draggable";
import { Button, ColorPicker, ColorSwatch } from "@mantine/core";
import { Tooltip } from "../components";
import toast from "react-hot-toast";
import { updateColor } from "../lib/db";
import { OpenBoxIcon, SingleCategoryIcon } from "../assets";
import { useClickOutside } from "@mantine/hooks";

function UpdateColor({ data, mutateKey, type, additionalMutate, size = 22 }) {
  const [showPicker, setShowPicker] = useState(false);
  const [hex, setHex] = useState(data?.color?.hex || "#ffffff");
  const { colors } = useUserColors();
  const handleCancel = () => {
    setHex(data?.color?.hex);
    setShowPicker(false);
  };

  const onClick = () => setShowPicker(!showPicker);

  const clickRef = useClickOutside(handleCancel);

  let colorTrigger = (
    <ColorSwatch
      color={data?.color?.hex}
      size={size}
      onClick={onClick}
      className="cursor-pointer"
    />
  );

  if (type === "category") {
    colorTrigger = (
      <SingleCategoryIcon width={size} fill={hex} onClick={onClick} />
    );
  }

  if (type === "container") {
    colorTrigger = <OpenBoxIcon width={size} fill={hex} onClick={onClick} />;
  }

  const handleSetColor = async () => {
    if (data?.color?.hex == hex) return setShowPicker(false);
    const updated = structuredClone(data);
    updated.color.hex = hex;
    try {
      await mutate(
        mutateKey,
        updateColor({
          id: data.id,
          hex,
          type,
        }),
        {
          optimisticData: updated,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      if (additionalMutate) {
        mutate(additionalMutate);
      }
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
        <div onClick={() => setShowPicker(!showPicker)}>{colorTrigger}</div>
      </Tooltip>

      {showPicker ? (
        <Draggable handle=".handle">
          <div
            ref={clickRef}
            className="bg-white border-2 px-2 z-[60] absolute top-[15%]"
          >
            <div className="handle h-10 lg:h-5 w-full bg-bluegray-100/50 border-y-8 border-white" />
            <ColorPicker
              color={hex}
              defaultValue={data?.color?.hex}
              swatches={colors}
              onChange={setHex}
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
                disabled={data?.color?.hex === hex}
              >
                Set color
              </Button>
            </div>
            <div className="handle h-10 lg:h-5 w-full bg-bluegray-100/50 border-y-8 border-white" />
          </div>
        </Draggable>
      ) : null}
    </>
  );
}

export default UpdateColor;
