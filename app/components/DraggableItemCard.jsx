import { useState } from "react";
import { Card } from "@mantine/core";
import Draggable from "./Draggable";
import DetailsSpoiler from "./DetailsSpoiler";
import Link from "next/link";
import DetailsTrigger from "./DetailsTrigger";
import Favorite from "./Favorite";

const DraggableItemCard = ({
  item,
  activeItem,
  bgColor = "bg-white",
  shadow = "!shadow-md active:!shadow-sm",
  handleItemFavoriteClick,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return activeItem?.name === item.name ? null : (
    <Draggable key={item.name} id={item.name} item={item}>
      <Card
        padding="xs"
        radius="md"
        classNames={{
          root: `
          ${item.name === activeItem?.name ? "!hidden" : ""}
           ${bgColor} ${shadow} overflow-hidden !px-4 !py-3 hover:!brightness-90 relative`,
        }}
      >
        <Link
          prefetch={false}
          className="w-full h-full absolute top-0 left-0"
          href={`/items/${item.id}`}
        />
        <div className="flex flex-row gap-3 items-center justify-center h-full overflow-hidden">
          <div className="flex flex-col gap-0 w-full items-start h-full">
            <div className="w-full flex justify-between items-center">
              <div className="flex items-center gap-1 ml-5">
                <h1 className="text-base font-semibold py-1 leading-tight">
                  {item?.name}
                </h1>
                <Favorite
                  item={item}
                  onClick={handleItemFavoriteClick}
                  size={18}
                />
              </div>
              <DetailsTrigger
                showDetails={showDetails}
                setShowDetails={setShowDetails}
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
