import { Card, Image } from "@mantine/core";
import { v4 } from "uuid";
import CategoryPill from "./CategoryPill";
import {
  IconCircle,
  IconCircleCheck,
  IconCircleMinus,
} from "@tabler/icons-react";
import { cardStyles } from "../lib/styles";

const AddRemoveCard = ({
  item,
  isSelected,
  selectedItems,
  setSelectedItems,
  isRemove = false,
}) => {
  const handleSelect = () => {
    setSelectedItems(
      isSelected
        ? selectedItems.filter((i) => i.id != item.id)
        : [...selectedItems, item]
    );
  };
  return (
    <div
      key={item.name}
      onClick={handleSelect}
      className="cursor-pointer w-full h-full"
    >
      <Card
        key={item.id}
        radius={cardStyles.radius}
        className={`w-full h-full relative border-2 border-gray-100 hover:border-gray-200 !bg-gray-100 hover:!bg-gray-200 aspect-[2.5/1] ${
          isSelected
            ? `opacity-100 ${
                isRemove
                  ? "!border-danger-500 hover:!border-danger-500"
                  : "!border-primary-500 hover:!border-primary-500"
              }`
            : "opacity-50"
        }`}
        id={item.id}
      >
        <div className="absolute top-2 right-2">
          {isSelected ? (
            isRemove ? (
              <IconCircleMinus
                className="bg-danger text-white rounded-full"
                size={30}
              />
            ) : (
              <IconCircleCheck
                className="bg-primary text-white rounded-full"
                size={30}
              />
            )
          ) : (
            <IconCircle className="bg-white rounded-full" size={30} />
          )}
        </div>
        <div className="flex flex-row gap-3 items-center justify-center h-full overflow-hidden">
          {item.images?.length ? (
            <Image
              alt="Album cover"
              className={cardStyles.imageClasses}
              src={item?.images[0]?.secureUrl}
              width="36%"
              height="100%"
              radius={cardStyles.radius}
            />
          ) : null}

          <div className="py-2 pl-2 flex flex-col gap-0 w-full items-start h-full">
            <h1 className="text-lg font-semibold pb-1">{item?.name}</h1>

            <div className="flex gap-1 flex-wrap mb-5">
              {item.categories?.map((category) => {
                return (
                  <CategoryPill
                    category={category}
                    key={v4()}
                    link={false}
                    size="xs"
                  />
                );
              })}
            </div>
            {item?.location?.name}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AddRemoveCard;
