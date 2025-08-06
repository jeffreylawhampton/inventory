import { ColorSwatch, Menu } from "@mantine/core";
import LucideIcon from "./LucideIcon";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";

const CardMenu = ({
  item,
  type,
  handleIconClick,
  handleColorClick,
  handleEditClick,
  handleDeleteClick,
  disabled = false,
}) => {
  return (
    <Menu
      disabled={disabled}
      shadow="0px 0px 9px #00000044"
      classNames={{
        dropdown: "!font-medium !text-[14px] !py-2",
        item: "!py-1.5",
        itemSection: "!mr-4",
      }}
    >
      <Menu.Target
        className={
          !disabled && "hover:!text-primary-700 active:!text-primary-800"
        }
      >
        <button>
          <EllipsisVertical
            size={26}
            aria-label={`Edit or delete ${item.name}`}
            className={disabled ? "opacity-30" : ""}
          />
        </button>
      </Menu.Target>
      <Menu.Dropdown>
        {handleColorClick ? (
          <Menu.Item
            leftSection={<ColorSwatch color={item?.color?.hex} size={16} />}
            onClick={handleColorClick}
          >
            Update color
          </Menu.Item>
        ) : null}
        <Menu.Item
          leftSection={
            <LucideIcon iconName={item?.icon} type={type} size={17} />
          }
          onClick={handleIconClick}
        >
          Update icon
        </Menu.Item>
        <Menu.Item leftSection={<Pencil size={16} />} onClick={handleEditClick}>
          Update {type}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          className="!text-danger-500 hover:!bg-danger-100/75"
          leftSection={<Trash size={16} />}
          onClick={handleDeleteClick}
        >
          Delete {item.name}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default CardMenu;
