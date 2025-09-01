import { useContext } from "react";
import { Popover, Button, UnstyledButton } from "@mantine/core";
import LucideIcon from "../LucideIcon";
import { getTextColor } from "@/app/lib/helpers";
import { ModalContext } from "@/app/providers";

const PickerMenu = ({
  data,
  type,
  handleIconPickerClick,
  updateColorClick,
  handleClick,
  iconSize = 18,
  isCard = true,
}) => {
  const { activePopoverId, setActivePopoverId, showDelete } =
    useContext(ModalContext);

  const popoverId = `${data?.id}-picker`;
  const opened = activePopoverId === popoverId;

  const toggle = () =>
    setActivePopoverId((prev) => (prev === popoverId ? null : popoverId));

  const handleChange = (next) => {
    setActivePopoverId(next ? popoverId : null);
  };
  return (
    <Popover
      classNames={{ dropdown: "!px-2 !py-3" }}
      closeOnClickOutside
      closeOnEscape
      opened={opened}
      onChange={handleChange}
    >
      <Popover.Target>
        <UnstyledButton
          onClick={
            showDelete
              ? () => handleClick(data)
              : type === "item"
              ? handleIconPickerClick
              : toggle
          }
          className={`relative ${showDelete ? "" : "hover:brightness-75"} ${
            isCard
              ? `flex items-center justify-center rounded-md w-9 h-9 lg:h-8 lg:w-8`
              : ""
          } `}
          style={
            isCard && !showDelete
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
              showDelete
                ? "black"
                : isCard && data?.color?.hex
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
          onClick={() => {
            setActivePopoverId(null);
            handleIconPickerClick(data, type);
          }}
          variant="subtle"
          color="black"
          className="!block mb-1 !w-full !py-1.5"
        >
          Update icon
        </Button>
        <Button
          onClick={() => {
            setActivePopoverId(null);
            updateColorClick();
          }}
          variant="subtle"
          color="black"
          w="auto"
          className="!py-1.5"
        >
          Update color
        </Button>
      </Popover.Dropdown>
    </Popover>
  );
};

export default PickerMenu;
