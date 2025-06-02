import { Menu, Button } from "@mantine/core";
import {
  IconBox,
  IconClipboardList,
  IconDots,
  IconHeart,
  IconTag,
  IconTrash,
} from "@tabler/icons-react";

const ContextMenu = ({ onAdd, onDelete, onCreate, type }) => {
  let createIcon = <IconClipboardList size={22} />;
  if (type === "containers") createIcon = <IconBox size={22} />;
  if (type === "categories") createIcon = <IconTag size={22} />;
  return (
    <Menu
      width={290}
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
            root: "fixed bottom-8 right-8 !w-16 !h-16 !p-0 z-20 transform-gpu !bg-primary-700",
          }}
        >
          <IconDots
            aria-label="Edit or delete item"
            size={36}
            strokeWidth={2}
          />
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          rightSection={<IconHeart aria-label="Add items" size={22} />}
          onClick={onAdd}
        >
          Add {type} to favorites
        </Menu.Item>

        <Menu.Divider />
        <Menu.Item
          color="danger.4"
          onClick={onDelete}
          rightSection={<IconTrash aria-label="Delete" size={22} />}
        >
          Delete {type}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ContextMenu;
