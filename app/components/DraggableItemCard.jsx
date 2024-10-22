import { useState } from "react";
import { Card } from "@mantine/core";
import Draggable from "./Draggable";
import DetailsSpoiler from "./DetailsSpoiler";
import Link from "next/link";
import DetailsTrigger from "./DetailsTrigger";

const DraggableItemCard = ({
  item,
  activeItem,
  bgColor = "bg-white",
  shadow = "drop-shadow-sm",
}) => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <Draggable key={item.name} id={item.name} item={item}>
      <Card
        padding="xs"
        radius="md"
        classNames={{
          root: `${
            item.name === activeItem?.name ? "opacity-0" : ""
          } ${bgColor} ${shadow} overflow-hidden !p-3 hover:!brightness-90 relative`,
        }}
      >
        <Link
          className="w-full h-full absolute top-0 left-0"
          href={`/items/${item.id}`}
        />
        <div className="ml-7 flex flex-row gap-3 items-center justify-center h-full overflow-hidden">
          <div className="flex flex-col gap-0 w-full items-start h-full">
            <div className="w-full flex justify-between items-center ">
              <h1 className="text-base font-semibold py-1 leading-tight">
                {item?.name}
              </h1>
              <DetailsTrigger
                showDetails={showDetails}
                setShowDetails={setShowDetails}
                label=""
                textColor="text-black"
                iconSize={22}
              />
            </div>

            <DetailsSpoiler
              item={item}
              showInnerCategories
              marginTop=""
              showDetails={showDetails}
            />
          </div>
        </div>
      </Card>
    </Draggable>
  );
};

export default DraggableItemCard;
