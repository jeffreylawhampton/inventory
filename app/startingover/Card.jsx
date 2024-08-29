import { Card, CardBody, Image } from "@nextui-org/react";
import CategoryChip from "../components/CategoryChip";
import { v4 } from "uuid";

const ItemCard = ({ item, activeItem }) => {
  return (
    <Card
      classNames={{
        base: `bg-white w-full
         
         `,
      }}
    >
      <CardBody className="flex flex-row gap-3 items-center justify-center h-full overflow-hidden">
        {item?.images?.length ? (
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
            {item?.categories?.map((category) => {
              return <CategoryChip key={v4()} category={category} />;
            })}
          </div>
          {item?.location?.name}
        </div>
      </CardBody>
    </Card>
  );
};

export default ItemCard;

// ${activeItem?.name === item.name ? "hidden" : ""}
