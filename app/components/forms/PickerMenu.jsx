import { useContext, useEffect } from "react";
import { Popover, Button, UnstyledButton } from "@mantine/core";
import LucideIcon from "../LucideIcon";
import { getTextColor } from "@/app/lib/helpers";
import { DeviceContext } from "@/app/providers";

const PickerMenu = ({
  opened,
  setOpened,
  data,
  type,
  handleIconPickerClick,
  updateColorClick,
  iconSize = 18,
  isCard = true,
}) => {
  const { isMobile } = useContext(DeviceContext);

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      classNames={{ dropdown: "!p-2" }}
    >
      <Popover.Target>
        <UnstyledButton
          onClick={
            type === "item" ? handleIconPickerClick : () => setOpened((o) => !o)
          }
          className={`${
            isCard
              ? `flex items-center justify-center rounded-md ${
                  isMobile ? "w-7 h-7" : "w-8 h-8"
                }`
              : ""
          } hover:brightness-75`}
          style={
            isCard
              ? {
                  backgroundColor:
                    data?.color?.hex ?? "var(--mantine-color-bluegray-1)",
                }
              : ""
          }
        >
          <LucideIcon
            iconName={data?.icon}
            type={type}
            fill={isCard ? "transparent" : data?.color?.hex ?? "transparent"}
            stroke={
              isCard && data?.color?.hex
                ? getTextColor(data?.color?.hex)
                : "black"
            }
            classes="relative"
            size={iconSize}
          />
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown>
        <Button
          onClick={handleIconPickerClick}
          variant="subtle"
          color="black"
          className="!block mb-1 !w-full"
        >
          Update icon
        </Button>
        <Button
          onClick={updateColorClick}
          variant="subtle"
          color="black"
          w="auto"
        >
          Update color
        </Button>
      </Popover.Dropdown>
    </Popover>
  );
};

export default PickerMenu;
