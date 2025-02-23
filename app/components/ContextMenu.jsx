import { Menu, Button } from "@mantine/core";
import {
  IconCircleMinus,
  IconClipboardList,
  IconClipboardPlus,
  IconCubePlus,
  IconDots,
  IconMapPinPlus,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";

const ContextMenu = ({
  onAdd,
  onDelete,
  onEdit,
  onRemove,
  showRemove = true,
  type,
  onCreateItem,
  onCreateContainer,
  onCreateCategory,
  onCreateLocation,
  showDeleteOption = true,
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
        {onEdit ? (
          <Menu.Item
            onClick={onEdit}
            rightSection={<IconPencil aria-label="Edit" size={22} />}
          >
            Edit {type}
          </Menu.Item>
        ) : null}

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

        {onCreateCategory ? (
          <Menu.Item
            rightSection={
              <IconClipboardPlus aria-label="Create category" size={22} />
            }
            onClick={onCreateCategory}
          >
            Create new category
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

        {onCreateLocation ? (
          <Menu.Item
            rightSection={
              <IconMapPinPlus aria-label="Create location" size={22} />
            }
            onClick={onCreateLocation}
          >
            Create new location
          </Menu.Item>
        ) : null}

        {type === "item" || type === "categories" || !showRemove ? null : (
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

        {showDeleteOption ? (
          <Menu.Item
            color="danger.4"
            onClick={onDelete}
            rightSection={<IconTrash aria-label="Delete" size={22} />}
          >
            Delete {type}
          </Menu.Item>
        ) : null}
      </Menu.Dropdown>
    </Menu>
  );
};

export default ContextMenu;
