import { Button } from "@mantine/core";

const Empty = ({ onClick }) => {
  return (
    <div className="flex flex-col gap-3">
      Nothing to see here, folks.
      <Button variant="light" w="fit-content" size="md" onClick={onClick}>
        Add items
      </Button>
    </div>
  );
};

export default Empty;
