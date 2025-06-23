"use client";
import FooterButtons from "../FooterButtons";
import AddRemoveCard from "../AddRemoveCard";
import Loading from "../Loading";
import { addItems } from "@/app/lib/db";
import { fetcher, handleToggleSelect } from "@/app/lib/helpers";
import { notify } from "@/app/lib/handlers";
import { mutate } from "swr";
import useSWR from "swr";
import SearchFilter from "../SearchFilter";
import { Suspense, useState } from "react";
import { Loader, ScrollArea } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

const AddItems = ({ type, pageData, mutateKey, close, additionalMutate }) => {
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
      notify({
        message: `Added ${selectedItems.length} ${
          selectedItems.length === 1 ? "item" : "items"
        } to ${pageData?.name?.toLowerCase()}`,
      });
      setSelectedItems([]);
      mutate(`/items/api?search=`);
      mutate(additionalMutate);
      close();
    } catch (e) {
      notify({ isError: true });
      throw new Error(e);
    }
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
