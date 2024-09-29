import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Tooltip from "./Tooltip";
import { tooltipStyles } from "../lib/styles";

const CreateButton = ({ onClick, tooltipText }) => {
  return (
    <Tooltip
      label={tooltipText}
      radius={tooltipStyles.radius}
      position="top-end"
      offset={tooltipStyles.offset}
      color={tooltipStyles.color}
      classNames={{ tooltip: tooltipStyles.classes }}
    >
      <Button
        onClick={onClick}
        size="lg"
        radius="50%"
        className="!fixed md:bottom-8 right-8 text-white"
        classNames={{
          root: "fixed bottom-8 right-8 !w-16 !h-16 !p-0",
        }}
      >
        <IconPlus
          className=" text-white"
          aria-label="Create new item"
          size={36}
          strokeWidth={3}
        />
      </Button>
    </Tooltip>
  );
};

export default CreateButton;
