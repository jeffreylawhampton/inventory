import { Card } from "@mantine/core";
import CategoryPill from "../components/CategoryPill";
import { v4 } from "uuid";
import { cardStyles } from "../lib/styles";
import { useDraggable } from "@dnd-kit/core";
import { IconGripVertical } from "@tabler/icons-react";
import { getFontColor } from "../lib/helpers";

const DraggableItemCard = ({
  item,
  activeItem,
  bgColor = "bg-white",
  shadow = "drop-shadow-sm",
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
      data: { item },
    });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10000,
      }
    : undefined;

  return (
    <div
      className={`touch-none relative ${
        isDragging ? "!drop-shadow-xl absolute z-[10000000]" : ""
      }`}
      ref={setNodeRef}
      style={style}
    >
      <IconGripVertical
        {...listeners}
        {...attributes}
        // style={style}
        className={`touch-none cursor-grab absolute top-[22px] left-2 z-50 "text-black !top-[30%]"
      `}
      />
      <Card
        component="a"
        href={`/items/${item.id}`}
        padding="xs"
        radius={cardStyles.radius}
        classNames={{
          root: ` ${bgColor} hover:bg-bluegray-100 ${shadow} overflow-hidden`,
        }}
      >
        <div className="ml-10 flex flex-row gap-3 items-center justify-center h-full overflow-hidden">
          <div className="flex flex-col gap-0 w-full items-start h-full">
            <h1 className="text-base font-semibold py-1 mb-1 leading-tight">
              {item?.name}
            </h1>

            <div className="flex gap-1 flex-wrap mb-5">
              {item?.categories?.map((category) => {
                return (
                  <CategoryPill key={v4()} category={category} size="xs" />
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

export default DraggableItemCard;

//     {/* <Draggable key={item.name} id={item.name} item={item}>
//       <Card
//         component="a"
//         href={`/items/${item.id}`}
//         padding="xs"
//         radius={cardStyles.radius}
//         classNames={{
//           root: `${
//             item.name === activeItem?.name ? "opacity-0" : ""
//           } ${bgColor} hover:bg-bluegray-100 ${shadow} overflow-hidden`,
//         }}
//       >
//         <div className="ml-10 flex flex-row gap-3 items-center justify-center h-full overflow-hidden">
//           <div className="flex flex-col gap-0 w-full items-start h-full">
//             <h1 className="text-base font-semibold py-1 mb-1 leading-tight">
//               {item?.name}
//             </h1>

//             <div className="flex gap-1 flex-wrap mb-5">
//               {item?.categories?.map((category) => {
//                 return (
//                   <CategoryPill key={v4()} category={category} size="xs" />
//                 );
//               })}
//             </div>
//             {item?.location?.name}
//           </div>
//         </div>
//       </Card>
//     </Draggable>

// "use client";
// import { useDraggable } from "@dnd-kit/core";
// import { IconGripVertical } from "@tabler/icons-react";
// import { getFontColor } from "../lib/helpers";

// export default function Draggable({ id, item, children, activeItem }) {
//   // todo: remove iscontainer
//   const isContainer = item.hasOwnProperty("parentContainerId");
//   const type = item.hasOwnProperty("parentContainerId") ? "container" : "item";
//   item = { ...item, type };
//   const { attributes, listeners, setNodeRef, transform, isDragging } =
//     useDraggable({
//       id: id,
//       data: { item, isContainer },
//     });
//   const style = transform
//     ? {
//         transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
//       }
//     : undefined;

//   return (
//     <div
//       className={`touch-none relative ${
//         activeItem?.id == item.id ? "hidden" : ""
//       } ${isDragging ? "!drop-shadow-xl" : ""}`}
//       ref={setNodeRef}
//     >
//       <IconGripVertical
//         size={isDragging ? 0 : 30}
//         {...listeners}
//         {...attributes}
//         style={style}
//         className={`touch-none cursor-grab absolute top-[22px] left-2 z-50 ${
//           isContainer ? getFontColor(item?.color?.hex) : "text-black !top-[30%]"
//         }`}
//       />
//       {children}
//     </div>
//   );
// }
