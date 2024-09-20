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
import { ColorSwatch, ScrollArea } from "@mantine/core";
import AddRemoveModal from "@/app/components/AddRemoveModal";
import { sortObjectArray } from "@/app/lib/helpers";
import { useRouter } from "next/navigation";
import UpdateColor from "@/app/components/UpdateColor";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import Loading from "@/app/components/Loading";
import Tooltip from "@/app/components/Tooltip";
import ItemGrid from "@/app/components/ItemGrid";

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
  const [color, setColor] = useState(data?.color);
  const [showPicker, setShowPicker] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [opened, { open, close }] = useDisclosure();
  const { height } = useViewportSize();
  const { user } = useUser();
  const router = useRouter();

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
    if (data?.color == color) return setShowPicker(false);

    try {
      await mutate(
        `categories${id}`,
        updateCategory({
          id: data.id,
          name: data.name,
          color,
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
      <div className="flex gap-3 items-center pb-4">
        <h1 className="font-bold text-3xl">{data?.name}</h1>
        <Tooltip
          label="Update color"
          textClasses={showPicker ? "hidden" : "!text-black font-medium"}
        >
          <ColorSwatch
            color={color}
            onClick={() => setShowPicker(!showPicker)}
            className="cursor-pointer"
          />
        </Tooltip>

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
          {sortObjectArray(filteredResults).map((item) => {
            return <ItemCard key={item.name} item={item} showLocation={true} />;
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
    </>
  );
};

export default Page;
