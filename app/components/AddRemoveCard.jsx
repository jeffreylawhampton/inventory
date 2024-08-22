import { Card, CardBody, Chip, Image } from "@nextui-org/react";
import { getFontColor } from "../lib/helpers";
import { v4 } from "uuid";
import { Circle, CircleCheck, CircleMinus } from "lucide-react";

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
        className={`w-full h-full relative border-2 border-[#f4f4f4] hover:border-[#ececec] bg-[#f4f4f4] hover:bg-[#ececec] aspect-[2.5/1] drop-shadow-md ${
          isSelected
            ? `opacity-100 ${
                isRemove
                  ? "border-danger hover:border-danger"
                  : "border-info hover:border-info"
              }`
            : "opacity-50"
        }`}
        shadow="sm"
        id={item.id}
      >
        <div className="absolute top-2 right-2">
          {isSelected ? (
            isRemove ? (
              <CircleMinus
                className="bg-danger text-white rounded-full"
                size={30}
              />
            ) : (
              <CircleCheck
                className="bg-info text-white rounded-full"
                size={30}
              />
            )
          ) : (
            <Circle className="bg-white rounded-full" size={30} />
          )}
        </div>
        <CardBody className="flex flex-row gap-3 items-center justify-center h-full overflow-hidden">
          {item.images?.length ? (
            <Image
              alt="Album cover"
              className="object-cover overflow-hidden min-h-[100%] w-[36%] min-w-[36%]"
              shadow="sm"
              src={item?.images[0]?.secureUrl}
              width="36%"
              height="100%"
              removeWrapper
            />
          ) : null}

          <div className="py-2 pl-2 flex flex-col gap-0 w-full items-start h-full">
            <h1 className="text-lg font-semibold pb-1">{item?.name}</h1>

            <div className="flex gap-1 flex-wrap mb-5">
              {item.categories?.map((category) => {
                return (
                  <Chip
                    style={{
                      backgroundColor: `${category?.color}`,
                    }}
                    key={v4()}
                    classNames={{
                      content: `font-medium text-[11px] ${getFontColor(
                        category.color
                      )}`,
                      base: "p-0 bg-opacity-50 rounded-lg",
                    }}
                  >
                    {category?.name}
                  </Chip>
                );
              })}
            </div>
            {item?.location?.name}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddRemoveCard;
