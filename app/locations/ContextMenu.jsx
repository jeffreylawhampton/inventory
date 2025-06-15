import { Menu, Button } from "@mantine/core";
import {
  IconCameraMinus,
  IconCameraPlus,
  IconClipboardList,
  IconClipboardPlus,
  IconCubePlus,
  IconDots,
  IconMapPinPlus,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";

const ContextMenu = ({
  onCreateLocation,
  onCreateContainer,
  onCreateItem,
  onEdit,
  onDelete,
  onDeleteSelected,
  onDeleteImages,
  currentName,
  onAdd,
  onUpload,
  showDeleteOption,
}) => {
  return (
    <>
      <Menu
        width={"100%"}
        classNames={{
          dropdown: "!font-medium !text-md !py-4 max-w-[360px]",
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
            <IconDots
              aria-label="Edit or delete item"
              size={36}
              strokeWidth={2}
            />
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
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
          {onEdit ? (
            <Menu.Item
              onClick={onEdit}
              rightSection={<IconPencil aria-label="Edit" size={22} />}
            >
              Edit {currentName}
            </Menu.Item>
          ) : null}

          {onAdd ? (
            <Menu.Item
              rightSection={
                <IconClipboardList aria-label="Add items" size={22} />
              }
              onClick={onAdd}
            >
              {addLabel}
            </Menu.Item>
          ) : null}

          {onCreateItem ? (
            <Menu.Item
              rightSection={
                <IconClipboardPlus aria-label="Create item" size={22} />
              }
              onClick={onCreateItem}
            >
              Create item in {currentName}
            </Menu.Item>
          ) : null}

          {onCreateContainer ? (
            <Menu.Item
              rightSection={
                <IconCubePlus aria-label="Create container" size={22} />
              }
              onClick={onCreateContainer}
            >
              Create container in {currentName}
            </Menu.Item>
          ) : null}

          <Menu.Divider />
          {onUpload ? (
            <Menu.Item
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                document.getElementById("cloud-upload-trigger")?.click();
              }}
              rightSection={
                <IconCameraPlus aria-label="Upload images" size={22} />
              }
            >
              Upload images
            </Menu.Item>
          ) : null}

          {onDeleteImages ? (
            <Menu.Item
              onClick={onDeleteImages}
              rightSection={
                <IconCameraMinus aria-label="Delete images" size={22} />
              }
            >
              Delete images
            </Menu.Item>
          ) : null}

          <Menu.Divider />
          {showDeleteOption ? (
            <>
              {onDeleteSelected ? (
                <Menu.Item
                  color="danger.4"
                  onClick={onDeleteSelected}
                  rightSection={
                    <IconTrash aria-label="Delete selected item" size={22} />
                  }
                >
                  Delete {currentName?.toLowerCase()}
                </Menu.Item>
              ) : null}
              <Menu.Item
                color="danger.4"
                onClick={onDelete}
                rightSection={<IconTrash aria-label="Delete" size={22} />}
              >
                Delete multiple
              </Menu.Item>
            </>
          ) : null}
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default ContextMenu;
