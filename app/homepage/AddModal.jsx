"use client";
import { useState } from "react";
import { Loading, MasonryGrid, SearchFilter } from "@/app/components";
import { Button, Modal, ScrollArea } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { v4 } from "uuid";
import AddCard from "./AddCard";

const AddModal = ({
  close,
  opened,
  type,
  handleAdd,
  selectedItems,
  setSelectedItems,
  unfaves,
  unfavesLoading,
}) => {
  const [filter, setFilter] = useState("");
  const { height } = useViewportSize();

  const maxSize = height * 0.6;

  let filteredResults = unfaves?.filter((item) =>
    item.name?.toLowerCase().includes(filter.toLowerCase())
  );

  const handleCancel = () => {
    setSelectedItems([]);
    close();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleCancel}
      title={type}
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
        title: "!font-semibold !text-3xl capitalize",
        inner: "!items-end md:!items-center !px-0 lg:!p-8",
        content: "py-4 px-2 !max-h-[94vh]",
      }}
    >
      <div className="flex flex-col justify-between min-h-[50vh]">
        <div>
          <SearchFilter
            label={"Filter by name"}
            onChange={(e) => setFilter(e.target.value)}
            filter={filter}
          />

          <ScrollArea.Autosize
            mah={maxSize}
            mih={maxSize}
            classNames={{ viewport: "!pb-4" }}
          >
            <MasonryGrid>
              {unfavesLoading ? (
                <Loading />
              ) : (
                filteredResults?.map((item) => {
                  return (
                    <AddCard
                      key={v4()}
                      item={item}
                      type={type}
                      isSelected={selectedItems?.includes(item.id)}
                      setSelectedItems={setSelectedItems}
                      selectedItems={selectedItems}
                    />
                  );
                })
              )}
            </MasonryGrid>
          </ScrollArea.Autosize>
        </div>
        <div className="flex gap-2 justify-end my-4">
          <Button color="danger" variant="light" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleAdd}
            disabled={!selectedItems.length}
          >
            Add
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddModal;
