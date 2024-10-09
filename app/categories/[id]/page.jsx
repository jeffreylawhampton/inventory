"use client";
import { deleteCategory, updateCategory } from "../api/db";
import toast from "react-hot-toast";
import EditCategory from "../EditCategory";
import { useUser } from "@/app/hooks/useUser";
import useSWR, { mutate } from "swr";
import ItemCard from "@/app/components/ItemCard";
import SearchFilter from "@/app/components/SearchFilter";
import { useState, useEffect } from "react";
import ContextMenu from "@/app/components/ContextMenu";
import {
  Anchor,
  Breadcrumbs,
  Button,
  ColorSwatch,
  ScrollArea,
} from "@mantine/core";
import AddRemoveModal from "@/app/components/AddRemoveModal";
import { sortObjectArray } from "@/app/lib/helpers";
import { useRouter } from "next/navigation";
import UpdateColor from "@/app/components/UpdateColor";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import Loading from "@/app/components/Loading";
import Tooltip from "@/app/components/Tooltip";
import ItemGrid from "@/app/components/ItemGrid";
import {
  IconChevronRight,
  IconTag,
  IconTags,
  IconTagsFilled,
  IconHeart,
  IconHeartFilled,
} from "@tabler/icons-react";
import { breadcrumbStyles } from "@/app/lib/styles";
import { toggleFavorite } from "@/app/lib/db";
import CreateItem from "./CreateItem";

const fetcher = async (id) => {
  const res = await fetch(`/categories/api/${id}`);
  const data = await res.json();
  return data.category;
};

const Page = ({ params: { id } }) => {
  const { data, isLoading, error } = useSWR(`categories${id}`, () =>
    fetcher(id)
  );
  const [filter, setFilter] = useState("");
  const [isRemove, setIsRemove] = useState(false);
  const [color, setColor] = useState(data?.color?.hex);
  const [showPicker, setShowPicker] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [opened, { open, close }] = useDisclosure();
  const { height } = useViewportSize();
  const { user } = useUser();

  const maxHeight = height * 0.75;

  useEffect(() => {
    setColor(data?.color?.hex);
  }, [data]);

  if (isLoading) return <Loading />;
  if (error) return <div>failed to load</div>;

  const handleRemove = () => {
    setIsRemove(true);
    setShowItemModal(true);
  };

  const handleAdd = () => {
    setIsRemove(false);
    setShowItemModal(true);
  };

  const handleSetColor = async () => {
    if (data?.color?.hex == color) return setShowPicker(false);

    try {
      await mutate(
        `categories${id}`,
        updateCategory({
          id: data.id,
          name: data.name,
          color: { hex: color },
          userId: data.userId,
        }),
        {
          optimisticData: { ...data, color: { hex: color } },
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      toast.success("Color updated");
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
    setShowPicker(false);
  };

  const handleFavoriteClick = async () => {
    const add = !data.favorite;
    try {
      await mutate(
        `categories${id}`,
        toggleFavorite({ type: "category", id: data.id, add }),
        {
          optimisticData: {
            ...data,
            favorite: add,
          },
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      toast.success(
        add
          ? `Added ${data.name} to favorites`
          : `Removed ${data.name} from favorites`
      );
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  const handleItemFavoriteClick = async ({ item }) => {
    const add = !item.favorite;
    const itemArray = [...data.items];
    const itemToUpdate = itemArray.find((i) => i.name === item.name);
    itemToUpdate.favorite = !item.favorite;

    try {
      await mutate(
        `categories${id}`,
        toggleFavorite({ type: "item", id: item.id, add }),
        {
          optimisticData: {
            ...data,
            itemArray,
          },
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      toast.success(
        add
          ? `Added ${item.name} to favorites`
          : `Removed ${item.name} from favorites`
      );
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
    close();
  };

  const handleDelete = async () => {
    if (
      !confirm(`Are you sure you want to delete ${data?.name || "this item"}`)
    )
      return;
    try {
      await mutate("categories", deleteCategory({ id }), {
        optimisticData: user?.categories?.filter(
          (category) => category.id != id
        ),
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      toast.success(`Successfully deleted ${data?.name}`);
    } catch (e) {
      toast.error("Something went wrong");
      throw e;
    }
  };

  const filteredResults = data?.items?.filter((item) =>
    item?.name?.toLowerCase().includes(filter?.toLowerCase())
  );

  return (
    <>
      <Breadcrumbs
        separatorMargin={6}
        separator={
          <IconChevronRight
            size={breadcrumbStyles.separatorSize}
            className={breadcrumbStyles.separatorClasses}
            strokeWidth={breadcrumbStyles.separatorStroke}
          />
        }
        classNames={breadcrumbStyles.breadCrumbClasses}
      >
        <Anchor href={"/categories"}>
          <IconTags
            size={24}
            aria-label="Categories"
            className={breadcrumbStyles.iconColor}
          />{" "}
          All categories
        </Anchor>
        <span>{data?.name}</span>
      </Breadcrumbs>
      <div className="flex gap-3 items-center pb-4">
        <Tooltip
          label="Update color"
          textClasses={showPicker ? "hidden" : "!text-black font-medium"}
        >
          <ColorSwatch
            color={color}
            size={24}
            onClick={() => setShowPicker(!showPicker)}
            className="cursor-pointer !mt-[-.6rem]"
          />
        </Tooltip>
        <h1 className="font-semibold text-3xl pb-3 flex gap-2 items-center">
          {data?.name}{" "}
          <div onClick={handleFavoriteClick}>
            {data?.favorite ? (
              <IconHeartFilled size={26} className="text-danger-400" />
            ) : (
              <IconHeart className="text-bluegray-500 hover:text-danger-200" />
            )}
          </div>
        </h1>

        {showPicker ? (
          <UpdateColor
            data={data}
            handleSetColor={handleSetColor}
            color={color}
            colors={user?.colors?.map((color) => color.hex)}
            setColor={setColor}
            setShowPicker={setShowPicker}
          />
        ) : null}
      </div>

      <SearchFilter
        label="Search for an item"
        filter={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <ScrollArea.Autosize
        mah={maxHeight}
        mih={maxHeight}
        type="hover"
        scrollHideDelay={200}
        scrollbarSize={10}
        classNames={{
          viewport: "pt-2 pb-12 px-2",
          thumb: "!bg-bluegray-4",
        }}
      >
        <ItemGrid desktop={3} xxl={4}>
          {sortObjectArray(filteredResults)?.map((item) => {
            return (
              <ItemCard
                key={item.name}
                item={item}
                showLocation={true}
                handleFavoriteClick={handleItemFavoriteClick}
              />
            );
          })}
        </ItemGrid>
      </ScrollArea.Autosize>
      <EditCategory
        data={data}
        id={id}
        opened={opened}
        close={close}
        user={user}
      />

      <ContextMenu
        onAdd={handleAdd}
        onRemove={data?.items?.length ? handleRemove : null}
        type="category"
        onDelete={handleDelete}
        onEdit={open}
        onCreateItem={() => setShowCreateItem(true)}
      />

      {showItemModal ? (
        <AddRemoveModal
          isRemove={isRemove}
          showItemModal={showItemModal}
          setShowItemModal={setShowItemModal}
          itemList={data?.items}
          type="category"
          name={data.name}
        />
      ) : null}

      {showCreateItem ? (
        <CreateItem
          showCreateItem={showCreateItem}
          setShowCreateItem={setShowCreateItem}
          data={data}
        />
      ) : null}
    </>
  );
};

export default Page;

// ("use client");
// import { deleteCategory, updateCategory } from "../api/db";
// import { toggleFavorite } from "@/app/lib/db";
// import toast from "react-hot-toast";
// import EditCategory from "../EditCategory";
// import { useUser } from "@/app/hooks/useUser";
// import useSWR from "swr";
// import ItemCard from "@/app/components/ItemCard";
// import SearchFilter from "@/app/components/SearchFilter";
// import { useState, useEffect } from "react";
// import ContextMenu from "@/app/components/ContextMenu";
// import {
//   Anchor,
//   Breadcrumbs,
//   Button,
//   ColorSwatch,
//   ScrollArea,
// } from "@mantine/core";
// import AddRemoveModal from "@/app/components/AddRemoveModal";
// import { sortObjectArray } from "@/app/lib/helpers";
// import { useRouter } from "next/navigation";
// import UpdateColor from "@/app/components/UpdateColor";
// import { useDisclosure, useViewportSize } from "@mantine/hooks";
// import Loading from "@/app/components/Loading";
// import Tooltip from "@/app/components/Tooltip";
// import ItemGrid from "@/app/components/ItemGrid";
// import {
//   IconChevronRight,
//   IconTag,
//   IconTags,
//   IconTagsFilled,
//   IconHeart,
//   IconHeartFilled,
// } from "@tabler/icons-react";
// import { breadcrumbStyles } from "@/app/lib/styles";

// const Page = ({ params: { id } }) => {
//   const { data, isLoading, error, mutate } = useSWR(`categories${id}`, () =>
//     fetcher(id)
//   );
//   const [filter, setFilter] = useState("");
//   const [isRemove, setIsRemove] = useState(false);
//   const [color, setColor] = useState(data?.color);
//   const [showPicker, setShowPicker] = useState(false);
//   const [showItemModal, setShowItemModal] = useState(false);
//   const [opened, { open, close }] = useDisclosure();
//   const { height } = useViewportSize();
//   const { user } = useUser();

//   const maxHeight = height * 0.75;

//   useEffect(() => {
//     setColor(data?.color?.hex);
//   }, [data]);

//   if (isLoading) return <Loading />;
//   if (error) return <div>failed to load</div>;

//   const handleRemove = () => {
//     setIsRemove(true);
//     setShowItemModal(true);
//   };

//   const handleAdd = () => {
//     setIsRemove(false);
//     setShowItemModal(true);
//   };

//   const handleFavoriteClick = async () => {
//     const add = !data.favorite;
//     try {
//       await mutate(toggleFavorite({ type: "category", id: data.id, add }), {
//         optimisticData: {
//           ...data,
//           favorite: add,
//         },
//         rollbackOnError: true,
//         populateCache: false,
//         revalidate: true,
//       });
//       toast.success(
//         add
//           ? `Added ${data.name} to favorites`
//           : `Removed ${data.name} from favorites`
//       );
//     } catch (e) {
//       toast.error("Something went wrong");
//       throw new Error(e);
//     }
//   };

//   const handleSetColor = async () => {
//     if (data?.color == color) return setShowPicker(false);

//     try {
//       await mutate(
//         `categories${id}`,
//         updateCategory({
//           id: data.id,
//           name: data.name,
//           color,
//           userId: data.userId,
//         }),
//         {
//           optimisticData: { ...data, color: { hex: color } },
//           rollbackOnError: true,
//           populateCache: false,
//           revalidate: true,
//         }
//       );
//       toast.success("Color updated");
//     } catch (e) {
//       toast.error("Something went wrong");
//       throw new Error(e);
//     }
//     setShowPicker(false);
//   };

//   const handleDelete = async () => {
//     if (
//       !confirm(`Are you sure you want to delete ${data?.name || "this item"}`)
//     )
//       return;
//     try {
//       await mutate("categories", deleteCategory({ id }), {
//         optimisticData: user?.categories?.filter(
//           (category) => category.id != id
//         ),
//         rollbackOnError: true,
//         populateCache: false,
//         revalidate: true,
//       });
//       toast.success(`Successfully deleted ${data?.name}`);
//     } catch (e) {
//       toast.error("Something went wrong");
//       throw e;
//     }
//   };

//   const filteredResults = data?.items?.filter((item) =>
//     item?.name?.toLowerCase().includes(filter?.toLowerCase())
//   );

//   console.log(data);

//   return (
//     <>
//       <Breadcrumbs
//         separatorMargin={6}
//         separator={
//           <IconChevronRight
//             size={breadcrumbStyles.separatorSize}
//             className={breadcrumbStyles.separatorClasses}
//             strokeWidth={breadcrumbStyles.separatorStroke}
//           />
//         }
//         classNames={breadcrumbStyles.breadCrumbClasses}
//       >
//         <Anchor href={"/categories"}>
//           <IconTags
//             size={24}
//             aria-label="Categories"
//             className={breadcrumbStyles.iconColor}
//           />{" "}
//           All categories
//         </Anchor>
//         <span>{data?.name}</span>
//       </Breadcrumbs>
//       <div className="flex gap-3 items-center pb-4 ">
//         <Tooltip
//           label="Update color"
//           textClasses={showPicker ? "hidden" : "!text-black font-medium"}
//         >
//           <ColorSwatch
//             color={color}
//             size={26}
//             onClick={() => setShowPicker(!showPicker)}
//             className="cursor-pointer"
//           />
//         </Tooltip>
//         <h1 className="font-semibold text-3xl pb-3 flex gap-2 items-center">
//           {data?.name}{" "}
//           <div onClick={handleFavoriteClick} className="mt-[3px]">
//             {data?.favorite ? (
//               <IconHeartFilled size={26} className="text-danger-400" />
//             ) : (
//               <IconHeart
//                 size={26}
//                 className="text-bluegray-500 hover:text-danger-200"
//               />
//             )}
//           </div>
//         </h1>
//         {showPicker ? (
//           <UpdateColor
//             data={data}
//             handleSetColor={handleSetColor}
//             color={color}
//             colors={user?.colors?.map((color) => color.hex)}
//             setColor={setColor}
//             setShowPicker={setShowPicker}
//           />
//         ) : null}
//       </div>

//       <SearchFilter
//         label="Search for an item"
//         filter={filter}
//         onChange={(e) => setFilter(e.target.value)}
//       />
//       <ScrollArea.Autosize
//         mah={maxHeight}
//         mih={maxHeight}
//         type="hover"
//         scrollHideDelay={200}
//         scrollbarSize={10}
//         classNames={{
//           viewport: "pt-2 pb-12 px-2",
//           thumb: "!bg-bluegray-4",
//         }}
//       >
//         <ItemGrid desktop={3} xxl={4}>
//           {sortObjectArray(filteredResults)?.map((item) => {
//             return <ItemCard key={item.name} item={item} showLocation={true} />;
//           })}
//         </ItemGrid>
//       </ScrollArea.Autosize>
//       <EditCategory
//         data={data}
//         id={id}
//         opened={opened}
//         close={close}
//         user={user}
//       />

//       <ContextMenu
//         onAdd={handleAdd}
//         onRemove={data?.items?.length ? handleRemove : null}
//         type="category"
//         onDelete={handleDelete}
//         onEdit={open}
//       />

//       {showItemModal ? (
//         <AddRemoveModal
//           isRemove={isRemove}
//           showItemModal={showItemModal}
//           setShowItemModal={setShowItemModal}
//           itemList={data?.items}
//           type="category"
//           name={data.name}
//         />
//       ) : null}
//     </>
//   );
// };

// export default Page;
