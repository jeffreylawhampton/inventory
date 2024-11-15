"use client";
import toast from "react-hot-toast";
import { mutate } from "swr";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import SearchFilter from "./SearchFilter";
import { Suspense, useState } from "react";
import { useParams } from "next/navigation";
import AddRemoveCard from "./AddRemoveCard";
import { Button, Loader, Modal, ScrollArea } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

const AddRemoveContainerModal = ({
  showItemModal,
  setShowItemModal,
  type,
  name,
  itemList,
  isRemove,
}) => {
  const [filter, setFilter] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const params = useParams();
  const plural = type === "category" ? "categories" : `${type}s`;
  const {
    data: itemsToAdd,
    isLoading,
    error,
  } = useSWR(`/api/items?filter=${params?.id}&type=${type}`, fetcher);
  const { height } = useViewportSize();

  const maxSize = height * 0.6;

  if (isLoading) return <Loader aria-label="Loading" />;
  if (error) return "Failed to fetch";

  const handleAdd = async () => {
    selectedItems.forEach((item) => itemList.push(item));
    if (type === "location") {
      try {
        await mutate(
          `/${plural}/api/${params.id}`,
          addLocationItems({
            locationId: params.id,
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
          `Added ${selectedItems.length} ${
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
    }
    try {
      await mutate(
        `/${plural}/api/${params.id}`,
        addItems({
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
        `Added ${selectedItems.length} ${
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

  let list = isRemove ? itemList : itemsToAdd?.items;

  const filteredResults = list.filter((item) =>
    item.name?.toLowerCase().includes(filter?.toLowerCase())
  );

  const hasResults = filteredResults?.length;

  return (
    <Modal
      opened={showItemModal}
      onClose={() => setShowItemModal(false)}
      title={`${isRemove ? "Remove" : "Add"} items ${
        isRemove ? "from" : "to"
      } ${name}`}
      radius="lg"
      size="100%"
      yOffset={0}
      transitionProps={{
        transition: "fade",
      }}
      overlayProps={{
        blur: 4,
      }}
      classNames={{
        title: "!font-semibold !text-xl",
        inner: "!items-end md:!items-center !px-0 lg:!p-8",
        content: "py-4 px-2 !max-h-[94vh]",
      }}
    >
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
              {hasResults ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-3">
                  {filteredResults
                    ?.sort((a, b) => a.name.localeCompare(b.name))
                    .map((item) => {
                      const isSelected = selectedItems.includes(item);
                      return (
                        <AddRemoveCard
                          key={item.name}
                          isSelected={isSelected}
                          item={item}
                          selectedItems={selectedItems}
                          setSelectedItems={setSelectedItems}
                          isRemove={isRemove}
                        />
                      );
                    })}
                </div>
              ) : (
                "Nothing to see here folks"
              )}
            </ScrollArea.Autosize>
          </Suspense>
        </div>
        <div className="flex gap-2 justify-end my-4">
          <Button color="danger" variant="light" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={isRemove ? handleRemove : handleAdd}
            isDisabled={!selectedItems.length}
          >
            {selectedItems.length
              ? `${isRemove ? "Remove" : "Add"} ${selectedItems.length} ${
                  selectedItems.length === 1 ? "item" : "items"
                }`
              : isRemove
              ? "Remove"
              : "Add"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddRemoveContainerModal;
