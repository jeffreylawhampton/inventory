import { useState, useContext } from "react";
import { useUserColors } from "../hooks/useUserColors";
import { mutate } from "swr";
import Draggable from "react-draggable";
import { Button, ColorPicker, ColorSwatch, Menu } from "@mantine/core";
import toast from "react-hot-toast";
import { updateColor } from "../lib/db";
import { OpenBoxIcon, SingleCategoryIcon } from "../assets";
import { useClickOutside } from "@mantine/hooks";
import { DeviceContext } from "../layout";
import LucideIcon from "./LucideIcon";

function UpdateColor({ data, mutateKey, type, additionalMutate, size = 22 }) {
  const [showPicker, setShowPicker] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [hex, setHex] = useState(data?.color?.hex || "#ffffff");
  const { colors } = useUserColors();
  const { setShowIconPicker, isMobile } = useContext(DeviceContext);

  const handleUpdateColorClick = () => {
    setShowPopover(false);
    setShowPicker(true);
  };

  const handleUpdateIconClick = () => {
    setShowPopover(false);
    setShowIconPicker(true);
  };

  const handleCancel = () => {
    setHex(data?.color?.hex);
    setShowPicker(false);
  };
  const clickRef = useClickOutside(handleCancel);

  let colorTrigger = (
    <ColorSwatch
      color={data?.color?.hex}
      size={size}
      onClick={() => setShowPicker(true)}
      className="cursor-pointer"
    />
  );

  if (type === "category") {
    colorTrigger = (
      <SingleCategoryIcon
        width={size}
        fill={hex}
        onClick={() => setShowPopover(true)}
      />
    );
  }

  if (type === "container") {
    colorTrigger = (
      <OpenBoxIcon
        width={size}
        fill={hex}
        onClick={() => setShowPopover(true)}
      />
    );
  }

  const handleSetColor = async () => {
    setShowPicker(false);
    if (data?.color?.hex == hex) return;
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
  };

  return (
    <>
      <div
        onMouseLeave={() => setShowPopover(false)}
        onMouseEnter={() => setShowPopover(true)}
        className="relative"
      >
        <Menu
          width={160}
          opened={showPopover && !showPicker}
          withinPortal={false}
          offset={-50}
          position="left"
          classNames={{
            dropdown: "!font-medium !text-md p-2 lg:px-4 !left-[-120px]",
            item: "hover:bg-primary-100 active:bg-primary-200",
            root: "relative",
          }}
        >
          <Menu.Target>
            <LucideIcon
              iconName={data?.icon}
              stroke="black"
              fill={data?.color?.hex ?? "var(--mantine-color-primary-3)"}
              size={26}
              type={type}
            />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item onClick={handleUpdateColorClick}>Update color</Menu.Item>

            <Menu.Item onClick={handleUpdateIconClick}>Update icon</Menu.Item>
          </Menu.Dropdown>
        </Menu>

        {showPicker ? (
          <Draggable
            handle=".handle"
            defaultPosition={isMobile && { x: -200, y: -50 }}
          >
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
                onMouseLeave={() => setShowPopover(false)}
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
      </div>
    </>
  );
}

export default UpdateColor;

{
  /* <Menu
  width={300}
  classNames={{
    dropdown: "!font-medium !text-md !py-4",
    item: "!py-2.5",
  }}
>
  <Menu.Target>
    <Button
      size="lg"
      radius="50%"
      className="!fixed md:bottom-8 right-8"
      classNames={{
        root: "fixed bottom-8 right-8 !w-16 !h-16 !p-0 z-20 transform-gpu",
        inner: "bg-black",
      }}
    >
      <IconDots aria-label="Edit or delete item" size={36} strokeWidth={2} />
    </Button>
  </Menu.Target>

  <Menu.Dropdown>
    <Menu.Item onClick={handleUpdateColorClick}>Update color</Menu.Item>

    <Menu.Item onClick={handleUpdateIconClick}>Update icon</Menu.Item>
  </Menu.Dropdown>
</Menu>; */
}
