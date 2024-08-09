"use client";
import { CircularProgress } from "@nextui-org/react";
import NewItem from "./NewItem";
import { useState } from "react";
import useSWR from "swr";
import ItemCard from "../components/ItemCard";
import CreateNewButton from "../components/CreateNewButton";
import { fetcher } from "../lib/fetcher";

const Page = ({ searchParams }) => {
  const [showAddItem, setShowAddItem] = useState(false);
  const query = searchParams?.query || "";

  const { data, isLoading, error } = useSWR(
    `/items/api?search=${query}`,
    fetcher
  );

  if (isLoading) return <CircularProgress aria-label="Loading" />;
  if (error) return "Failed to fetch";

  return (
    <>
      {showAddItem ? (
        <NewItem setShowAddItem={setShowAddItem} data={data} query={query} />
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {data?.items
              ?.sort((a, b) => a.name.localeCompare(b.name))
              .map((item) => {
                return <ItemCard key={item.name} item={item} />;
              })}
          </div>
          <CreateNewButton
            tooltipText="Create new item"
            onClick={() => setShowAddItem(true)}
          />
        </div>
      )}
    </>
  );
};

export default Page;

//  <Card
// key={item.id}
// isPressable
// onPress={() =>
//   router.push(`/items/${item.id}?name=${item.name}`)
// }
// className="border-none bg-[#ececec] bg-opacity-60 dark:bg-default-100/50 max-w-[610px] hover:bg-opacity-80"
// shadow="sm"
// >
// <CardBody>
//   <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
//     {item.images?.length ? (
//       <div className="relative col-span-6 md:col-span-4">
//         <Image
//           alt="Album cover"
//           className="object-cover"
//           height={200}
//           shadow="sm"
//           src={item?.images[0]?.url}
//           width="100%"
//         />
//       </div>
//     ) : null}

//     <div className="flex flex-col gap-2 col-span-6 md:col-span-8 items-start justify-start h-full">

//       <h1 className="text-large font-medium">{item?.name}</h1>
//       <div className="flex justify-between items-start">
//         <div>
//           <div className="flex gap-1 flex-wrap">
//             {item.categories?.map((category) => {
//               return (
//                 <Chip
//                   style={{
//                     backgroundColor: category?.color,
//                     color: "white",
//                   }}
//                   key={category?.name}
//                   classNames={{
//                     content: "font-medium text-xs",
//                     base: "p-0",
//                   }}
//                 >
//                   {category?.name}
//                 </Chip>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       <div className="flex w-full items-center justify-center"></div>
//     </div>
//   </div>
// </CardBody>
// </Card>
