"use client";
import { Button, Card, CardBody, Chip, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { getFontColor } from "../lib/helpers";

const ItemCard = ({ item }) => {
  const router = useRouter();

  return (
    <Card
      key={item.id}
      isPressable
      onPress={() => router.push(`/items/${item.id}?name=${item.name}`)}
      className=" border-none bg-[#ececec] bg-opacity-60 dark:bg-default-100/50 hover:bg-opacity-80 aspect-[5/2]"
      shadow="sm"
    >
      <CardBody className="flex flex-row gap-3 items-center justify-center h-full overflow-hidden">
        {item.images?.length ? (
          <Image
            alt="Album cover"
            className="object-cover overflow-hidden min-h-[100%] w-[40%] min-w-[40%]"
            shadow="sm"
            src={item?.images[0]?.secureUrl}
            width="40%"
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
                  key={category?.name}
                  classNames={{
                    content: `font-medium xs:text-xs text-xs  ${getFontColor(
                      category.color
                    )}`,
                    base: "px-2 py-1 bg-opacity-50",
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
  );

  {
    /* <Card
      isPressable
      onPress={() => router.push(`/items/${item.id}?name=${item.name}`)}
      radius="lg"
      isFooterBlurred
      className="border-none overflow-hidden rounded-xl"
    >
      <Image
        alt=""
        removeWrapper
        className="object-cover overflow-hidden w-full h-full"
        src={item?.images[0]?.url}
      />
      <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
        <p className="text-tiny text-white/80">Available soon.</p>
        <Button
          className="text-tiny text-white bg-black/20"
          variant="flat"
          color="default"
          radius="lg"
          size="sm"
        >
          Notify me
        </Button>
      </CardFooter>
    </Card> */
  }
  // );
};

export default ItemCard;

// <Card
//   className="p-3"
//   isPressable
//   shadow="sm"
//   isHoverable
//   onPress={() => router.push(`/items/${item.id}?name=${item.name}`)}
//   classNames={{
//     base: "bg-gray-100",
//   }}
// >
//   {item.images?.length ? (
//     <CardBody className="p-0">
//       <Image
//         alt="Card background"
//         src={item?.images[0]?.url}
//         width={"100%"}
//         height="auto"
//       />
//     </CardBody>
//   ) : null}
//   <CardFooter className="py-2 px-1 flex-col items-start">
//     <h2 className="font-semibold text-large">{item.name}</h2>

//     <div className="flex gap-1 flex-wrap">
//       {item.categories?.map((category) => {
//         return (
//           <Chip
//             style={{
//               backgroundColor: `${category?.color}`,
//             }}
//             key={category?.name}
//             classNames={{
//               content: "font-semibold text-[11px] text-white ",
//               base: "p-0",
//             }}
//           >
//             {category?.name}
//           </Chip>
//         );
//       })}
//     </div>
//   </CardFooter>
// </Card>
