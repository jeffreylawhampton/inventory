import { Popover, Button, UnstyledButton } from "@mantine/core";
import LucideIcon from "../LucideIcon";

const PickerMenu = ({
  opened,
  setOpened,
  data,
  type,
  handleIconPickerClick,
  updateColorClick,
}) => {
  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      classNames={{ dropdown: "!p-2" }}
    >
      <Popover.Target>
        <UnstyledButton
          onClick={type === "item" ? handleIconPickerClick : null}
        >
          <LucideIcon
            iconName={data?.icon}
            type={type}
            onClick={() => setOpened((o) => !o)}
            fill={data?.color?.hex ?? "#fff"}
            stroke="#000"
          />
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown>
        <Button
          onClick={handleIconPickerClick}
          variant="subtle"
          color="black"
          className="!block mb-1 !w-full"
        >
          Update icon
        </Button>
        <Button
          onClick={updateColorClick}
          variant="subtle"
          color="black"
          w="auto"
        >
          Update color
        </Button>
      </Popover.Dropdown>
    </Popover>
  );
};

export default PickerMenu;
