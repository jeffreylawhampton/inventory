import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import { Ellipsis, Pencil, SquareMinus, SquarePlus, Trash } from "lucide-react";

const ContextMenu = ({ onAdd, onDelete, onEdit, onRemove, type }) => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          size="lg"
          color="info"
          isIconOnly
          textValue="Edit or delete item"
          className="fixed xs:bottom80 sm:bottom80 md:bottom-8 right-8 bg-primary text-white bottom80 drop-shadow-lg"
        >
          <Ellipsis aria-label="Edit or delete item" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Add, edit, or delete"
        disabledKeys={[onRemove ? "" : "remove"]}
      >
        <DropdownSection showDivider>
          <DropdownItem
            key="edit"
            endContent={
              <Pencil strokeWidth={2} size={16} aria-label={`Edit ${type}`} />
            }
            onClick={onEdit}
          >
            Edit {type}
          </DropdownItem>
          {onAdd ? (
            <DropdownItem
              key="copy"
              endContent={
                <SquarePlus
                  strokeWidth={2}
                  size={16}
                  aria-label={`Move items`}
                />
              }
              onClick={onAdd}
            >
              Add items
            </DropdownItem>
          ) : null}

          {type === "item" ? null : (
            <DropdownItem
              key="remove"
              endContent={
                <SquareMinus
                  strokeWidth={2}
                  size={16}
                  aria-label={`Remove items`}
                />
              }
              onClick={onRemove}
            >
              Remove items
            </DropdownItem>
          )}
        </DropdownSection>
        <DropdownSection>
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            onClick={onDelete}
            endContent={<Trash strokeWidth={2} size={16} />}
          >
            Delete {type}
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ContextMenu;
