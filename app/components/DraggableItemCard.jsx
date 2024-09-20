import { Card } from "@mantine/core";
import CategoryPill from "../components/CategoryPill";
import { v4 } from "uuid";
import Draggable from "./Draggable";
import { cardStyles } from "../lib/styles";

const DraggableItemCard = ({
  item,
  activeItem,
  bgColor = "bg-white",
  shadow,
}) => {
  return (
    <Draggable key={item.name} id={item.name} item={item}>
      <Card
        component="a"
        href={`/items/${item.id}`}
        radius={cardStyles.radius}
        shadow={cardStyles.shadow}
        classNames={{
          root: `${
            item.name === activeItem?.name ? "opacity-0" : ""
          } ${bgColor} hover:bg-bluegray-100 ${shadow}`,
        }}
      >
        <div className="ml-6 flex flex-row gap-3 items-center justify-center h-full overflow-hidden">
          <div className="py-1 pl-2 flex flex-col gap-0 w-full items-start h-full">
            <h1 className="text-base font-semibold pb-1 leading-tight">
              {item?.name}
            </h1>

            <div className="flex gap-1 flex-wrap mb-5">
              {item?.categories?.map((category) => {
                return <CategoryPill key={v4()} category={category} />;
              })}
            </div>
            {item?.location?.name}
          </div>
        </div>
      </Card>
    </Draggable>
  );
};

export default DraggableItemCard;
