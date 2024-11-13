import { Card, Button, UnstyledButton } from "@mantine/core";

const EmptyCard = ({ move, add, isCategory }) => {
  return (
    <Card
      classNames={{
        root: "!bg-bluegray-200 w-fit !px-6 !py-5 !rounded-xl mt-5 drop-shadow-sm",
      }}
    >
      <p className="font-semibold">Nothing to see here, folks.</p>
      <div>
        <a className="link" onClick={move}>
          {isCategory ? "Tag items" : "Move items here"}
        </a>{" "}
        or{" "}
        <a className="link" onClick={add}>
          create a new one
        </a>
        .
      </div>
    </Card>
  );
};

export default EmptyCard;
