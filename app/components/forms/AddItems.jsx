"use client";
import toast from "react-hot-toast";
import FooterButtons from "../FooterButtons";
import AddRemoveCard from "../AddRemoveCard";
import Loading from "../Loading";
import { addItems, removeItems } from "@/app/lib/db";
import { handleToggleSelect } from "@/app/lib/helpers";
import { mutate } from "swr";
import useSWR from "swr";
import { fetcher } from "@/app/lib/fetcher";
import SearchFilter from "../SearchFilter";
import { Suspense, useState } from "react";
import { Loader, ScrollArea } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

const AddItems = ({
  type,
  pageData,
  mutateKey,
  isRemove,
  close,
  additionalMutate,
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [filter, setFilter] = useState("");
  const { data, error, isLoading } = useSWR(`/items/api?search=`, fetcher);
  let itemList = [];
  if (type === "category") {
    itemList = data?.filter(
      (i) => !i.categories?.some((c) => c.name === pageData?.name)
    );
  } else {
    itemList = data?.filter((i) => i[type]?.id != pageData.id);
  }

  const filteredResults = itemList?.filter((i) =>
    i?.name?.toLowerCase()?.includes(filter?.toLowerCase())
  );

  const { height } = useViewportSize();

  const maxSize = height * 0.6;

  if (isLoading) return <Loading aria-label="Loading" />;
  if (error) return "Failed to fetch";

  const handleSelect = (item) => {
    return handleToggleSelect(item, selectedItems, setSelectedItems);
  };

  const handleAdd = async () => {
    try {
      await mutate(
        mutateKey,
        addItems({
          id: pageData.id,
          type,
          items: selectedItems,
          data: pageData,
        }),
        {
          optimisticData: {
            ...pageData,
            items: pageData?.items
              ?.concat(selectedItems)
              ?.sort((a, b) => a.name - b.name),
          },
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      toast.success(
        `Added ${selectedItems.length} ${
          selectedItems.length === 1 ? "item" : "items"
        }`
      );
      setSelectedItems([]);
      mutate(`/items/api?search=`);
      mutate(additionalMutate);
      close();
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  const handleRemove = async () => {
    selectedItems.forEach((item) => {
      itemList.splice(itemList.indexOf(item), 1);
    });

    try {
      await mutate(
        `/${plural}/api/${params.id}`,
        removeItems({
          id: params.id,
          type,
          items: selectedItems,
        }),
        {
          optimisticData: itemList,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      toast.success(
        `Removed ${selectedItems.length} ${
          selectedItems.length === 1 ? "item" : "items"
        }`
      );

      setShowItemModal(false);
      setSelectedItems([]);
      await mutate(`/api/items?filter=${params?.id}&type=${type}`);
      await mutate(`${type}${params.id}`);
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  const handleCancel = () => {
    setShowItemModal(false);
    setSelectedItems([]);
  };

  return (
    <div className="flex flex-col justify-between min-h-[50vh]">
      <div>
        <SearchFilter
          label={"Search for an item"}
          onChange={(e) => setFilter(e.target.value)}
          filter={filter}
        />

        <Suspense fallback={<Loader aria-label="Loading" />}>
          <ScrollArea.Autosize
            mah={maxSize}
            mih={maxSize}
            classNames={{ viewport: "!pb-4" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-3">
              {filteredResults
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .map((item) => {
                  const isSelected = selectedItems.includes(item);
                  return (
                    <AddRemoveCard
                      key={item.name}
                      isSelected={isSelected}
                      item={item}
                      handleSelect={handleSelect}
                      showAdd
                    />
                  );
                })}
            </div>
          </ScrollArea.Autosize>
        </Suspense>
      </div>
      <FooterButtons onClick={close} handleSubmit={handleAdd} />
    </div>
  );
};

export default AddItems;
