import { useContext } from "react";
import { Affix, Button, Menu } from "@mantine/core";
import {
  ClipboardMinus,
  ClipboardPlus,
  PackagePlus,
  Ellipsis,
  ImageMinus,
  ImagePlus,
  Layers,
  MapPinPlus,
  Pencil,
  Tag,
  Trash,
} from "lucide-react";
import { DeviceContext } from "../providers";

const ContextMenu = ({
  onAdd,
  onDelete,
  onEdit,
  onRemove,
  onUpload,
  onDeleteImages,
  showRemove = true,
  onDeleteItems,
  type,
  onCreateItem,
  onCreateContainer,
  onCreateCategory,
  onCreateLocation,
  showDeleteOption = true,
  addLabel = "Move items here",
  name,
}) => {
  const { opened } = useContext(DeviceContext);
  return (
    <Affix position={{ bottom: 30, right: 30 }}>
      <Menu
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
            classNames={{
              root: `!w-16 !h-16 !p-0 z-20 transform-gpu ${
                opened ? "hidden" : ""
              }`,
              inner: "bg-black",
            }}
          >
            <Ellipsis
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
              rightSection={<Pencil aria-label="Edit" size={22} />}
            >
              Edit {name?.toLowerCase()}
            </Menu.Item>
          ) : null}

          {onAdd ? (
            <Menu.Item
              rightSection={<Layers aria-label="Add items" size={22} />}
              onClick={onAdd}
            >
              {addLabel}
            </Menu.Item>
          ) : null}

          {onCreateItem ? (
            <Menu.Item
              rightSection={
                <ClipboardPlus aria-label="Create item" size={22} />
              }
              onClick={onCreateItem}
            >
              Create new item
            </Menu.Item>
          ) : null}

          {onCreateCategory ? (
            <Menu.Item
              rightSection={<Tag aria-label="Create category" size={22} />}
              onClick={onCreateCategory}
            >
              Create new category
            </Menu.Item>
          ) : null}

          {onCreateContainer ? (
            <Menu.Item
              rightSection={
                <PackagePlus aria-label="Create container" size={22} />
              }
              onClick={onCreateContainer}
            >
              Create new container
            </Menu.Item>
          ) : null}

          {onCreateLocation ? (
            <Menu.Item
              rightSection={
                <MapPinPlus aria-label="Create location" size={22} />
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
                <ClipboardMinus aria-label="Remove items" size={22} />
              }
              onClick={onRemove}
            >
              Remove items
            </Menu.Item>
          )}
          {onUpload ?? onDeleteImages ? <Menu.Divider /> : null}
          {onUpload ? (
            <Menu.Item
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                document.getElementById("cloud-upload-trigger")?.click();
              }}
              rightSection={<ImagePlus aria-label="Upload images" size={22} />}
            >
              Upload images
            </Menu.Item>
          ) : null}

          {onDeleteImages ? (
            <Menu.Item
              onClick={onDeleteImages}
              rightSection={<ImageMinus aria-label="Delete images" size={22} />}
            >
              Delete images
            </Menu.Item>
          ) : null}
          <Menu.Divider />
          {showDeleteOption ? (
            <Menu.Item
              color="danger.3"
              onClick={onDelete}
              rightSection={<Trash aria-label="Delete" size={22} />}
            >
              Delete {name ?? type ?? ""}
            </Menu.Item>
          ) : null}

          {onDeleteItems ? (
            <Menu.Item
              color="danger.3"
              onClick={onDeleteItems}
              rightSection={<Trash aria-label="Delete items" size={22} />}
            >
              Delete items
            </Menu.Item>
          ) : null}
        </Menu.Dropdown>
      </Menu>
    </Affix>
  );
};

export default ContextMenu;
