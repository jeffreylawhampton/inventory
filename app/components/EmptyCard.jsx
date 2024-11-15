import { Card, Button, UnstyledButton } from "@mantine/core";

const EmptyCard = ({
  move,
  add,
  addContainer,
  isCategory,
  moveLabel = isCategory ? "Tag items" : "Move items here",
  addLabel = "create a new item",
  headline = "Nothing to see here, folks.",
}) => {
  const addBoth = add && addContainer;
  return (
    <Card
      classNames={{
        root: "!bg-bluegray-200 w-full lg:w-fit !px-6 !py-8 !rounded-xl mt-5 drop-shadow-sm",
      }}
    >
      <p className="font-semibold text-lg">{headline}</p>
      <div>
        {move ? (
          <a className="link" onClick={move}>
            {moveLabel}
          </a>
        ) : null}
        {move && add ? " or " : null}
        {add && !addBoth ? (
          <a className="link" onClick={add}>
            {addLabel}
          </a>
        ) : addBoth ? (
          <>
            create a new{" "}
            <a onClick={addContainer} className="link">
              container{" "}
            </a>{" "}
            or{" "}
            <a onClick={add} className="link">
              item
            </a>
          </>
        ) : null}
        .
      </div>
    </Card>
  );
};

export default EmptyCard;
