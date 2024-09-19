import { Menu, Button } from "@mantine/core";
import {
  IconDots,
  IconCirclePlus,
  IconCircleMinus,
  IconTrash,
  IconPencil,
} from "@tabler/icons-react";

const ContextMenu = ({ onAdd, onDelete, onEdit, onRemove, type }) => {
  return (
    <Menu
      shadow="md"
      width={220}
      classNames={{
        dropdown: "!font-medium !text-md !py-4",
      }}
    >
      <Menu.Target>
        <Button
          size="lg"
          radius="50%"
          className="!fixed md:bottom-8 right-8 text-white drop-shadow-lg"
          classNames={{
            root: "fixed bottom-8 right-8 !w-16 !h-16 !p-0",
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
          onClick={onEdit}
          rightSection={<IconPencil aria-label="Edit" size={22} />}
        >
          Edit {type}
        </Menu.Item>
        {onAdd ? (
          <Menu.Item
            rightSection={<IconCirclePlus aria-label="Add items" size={22} />}
            onClick={onAdd}
          >
            Add items
          </Menu.Item>
        ) : null}

        {type === "item" ? null : (
          <Menu.Item
            disabled={!onRemove}
            rightSection={
              <IconCircleMinus aria-label="Remove items" size={22} />
            }
            onClick={onRemove}
          >
            Remove items
          </Menu.Item>
        )}

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
