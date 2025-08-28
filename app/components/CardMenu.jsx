import { ColorSwatch, Menu } from "@mantine/core";
import LucideIcon from "./LucideIcon";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import { useContext } from "react";
import { DeviceContext, ModalContext } from "../providers";

const CardMenu = ({
  item,
  type,
  handleIconClick,
  handleColorClick,
  handleEditClick,
  handleDeleteClick,
  disabled = false,
  iconSize = 26,
}) => {
  const { isMobile } = useContext(DeviceContext);
  const { activePopoverId, setActivePopoverId } = useContext(ModalContext);
  const opened = activePopoverId === item?.id + type + "-menu";
  const setOpened = () =>
    setActivePopoverId(opened ? null : item?.id + type + "-menu");

  return (
    <Menu
      disabled={disabled}
      shadow="0px 0px 9px #00000044"
      classNames={{
        dropdown: "!font-medium !text-base !py-2.5",
        item: "!py-2.5",
        itemSection: "!mr-4",
      }}
      opened={opened}
      onChange={setOpened}
    >
      <Menu.Target
        className={`!disabled && ${"hover:!text-primary-700 active:!text-primary-800"}`}
      >
        <button className="h-full px-2" onClick={setOpened}>
          <EllipsisVertical
            size={iconSize}
            aria-label={`Edit or delete ${item.name}`}
            className={disabled ? "opacity-30" : ""}
            width={isMobile ? 30 : 26}
            height={isMobile ? 30 : 26}
          />
        </button>
      </Menu.Target>
      <Menu.Dropdown>
        {handleColorClick ? (
          <Menu.Item
            leftSection={<ColorSwatch color={item?.color?.hex} size={16} />}
            onClick={handleColorClick}
            tabIndex={0}
            role="button"
          >
            Update color
          </Menu.Item>
        ) : null}
        {type === "location" ? null : (
          <Menu.Item
            leftSection={
              <LucideIcon iconName={item?.icon} type={type} size={17} />
            }
            onClick={handleIconClick}
            tabIndex={0}
            role="button"
          >
            Update icon
          </Menu.Item>
        )}
        <Menu.Item
          leftSection={<Pencil size={16} />}
          onClick={() => handleEditClick(item)}
          tabIndex={0}
          role="button"
        >
          Update {type}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          className="!text-danger-500 hover:!bg-danger-100/75"
          leftSection={<Trash size={16} />}
          onClick={handleDeleteClick}
          tabIndex={0}
          role="button"
        >
          Delete {item.name}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default CardMenu;
