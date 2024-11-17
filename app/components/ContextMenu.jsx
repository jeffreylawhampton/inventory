import { Menu, Button } from "@mantine/core";
import {
  IconClipboardPlus,
  IconCubePlus,
  IconDots,
  IconCirclePlus,
  IconCircleMinus,
  IconTrash,
  IconPencil,
  IconClipboardList,
} from "@tabler/icons-react";

const ContextMenu = ({
  onAdd,
  onDelete,
  onEdit,
  onRemove,
  type,
  onCreateItem,
  onCreateContainer,
}) => {
  return (
    <Menu
      width={260}
      classNames={{
        dropdown: "!font-medium !text-md !py-4",
        item: "!py-2.5",
      }}
    >
      <Menu.Target>
        <Button
          size="lg"
          radius="50%"
          className="!fixed md:bottom-8 right-8 text-white "
          classNames={{
            root: "fixed bottom-8 right-8 !w-16 !h-16 !p-0 z-20 transform-gpu",
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
            rightSection={
              <IconClipboardList aria-label="Add items" size={22} />
            }
            onClick={onAdd}
          >
            Move items here
          </Menu.Item>
        ) : null}

        {onCreateItem ? (
          <Menu.Item
            rightSection={
              <IconClipboardPlus aria-label="Create item" size={22} />
            }
            onClick={onCreateItem}
          >
            Create new item
          </Menu.Item>
        ) : null}

        {onCreateContainer ? (
          <Menu.Item
            rightSection={
              <IconCubePlus aria-label="Create container" size={22} />
            }
            onClick={onCreateContainer}
          >
            Create new container
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
