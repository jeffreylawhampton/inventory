"use client";
import {
  Button,
  CircularProgress,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { addItems, removeItems, addLocationItems } from "../api/items/db";
import { mutate } from "swr";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import SearchFilter from "./SearchFilter";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import AddRemoveCard from "./AddRemoveCard";
import Tooltip from "./Tooltip";
import { Info } from "lucide-react";

const AddRemoveModal = ({
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

  if (isLoading) return <CircularProgress aria-label="Loading" />;
  if (error) return "Failed to fetch";

  const handleAdd = async () => {
    selectedItems.forEach((item) => itemList.push(item));
    if (type === "location") {
      try {
        await mutate(
          `/${plural}/api/${params.id}?name=`,
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
        `/${plural}/api/${params.id}?name=`,
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
        `/${plural}/api/${params.id}?name=`,
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

  return (
    showItemModal && (
      <Modal
        isOpen={showItemModal}
        onOpenChange={() => setShowItemModal(false)}
        size="5xl"
        placement="bottom-center"
        scrollBehavior="inside"
        backdrop="blur"
        classNames={{
          backdrop: "bg-black bg-opacity-80",
          base: "px-2 py-4 lg:p-6 min-w-[90%] min-h-[85%]",
        }}
      >
        <ModalContent>
          <ModalHeader className="text-xl xl:text-2xl font-semibold gap-6 flex flex-col">
            <h2 className="flex items-center gap-1">
              {isRemove ? "Remove" : "Add"} items {isRemove ? "from" : "to"}{" "}
              {name}
              {isRemove ? (
                <Tooltip
                  placement="bottom"
                  text={
                    <p className="p-2 text-base">
                      Don&apos;t worry! You aren&apos;t deleting them.
                    </p>
                  }
                >
                  <Info size={18} />
                </Tooltip>
              ) : null}
            </h2>

            <SearchFilter
              classNames="hidden md:block"
              label={"Search for an item"}
              onChange={(e) => setFilter(e.target.value)}
              filter={filter}
            />
          </ModalHeader>
          <ModalBody>
            <Suspense fallback={<CircularProgress aria-label="Loading" />}>
              {filteredResults?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                "Nothing doing"
              )}
            </Suspense>
          </ModalBody>
          <ModalFooter className="flex flex-col items-end gap-0">
            <SearchFilter
              classNames="md:hidden"
              label={"Search for an item"}
              onChange={(e) => setFilter(e.target.value)}
              filter={filter}
            />

            <div>
              <Button color="danger" variant="light" onPress={handleCancel}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={isRemove ? handleRemove : handleAdd}
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
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  );
};

export default AddRemoveModal;
