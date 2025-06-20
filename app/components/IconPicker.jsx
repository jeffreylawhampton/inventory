import { useEffect, useContext } from "react";
import { Modal } from "@mantine/core";
import { useInViewRef } from "rooks";
import { useIconPicker } from "../hooks/useIconPicker";
import { DeviceContext } from "../layout";
import LucideIcon from "./LucideIcon";
import SearchFilter from "./SearchFilter";
import { handleAddIcon } from "../lib/handlers";

export default function IconPicker({ data, mutateKey }) {
  const { search, setSearch, icons, loadMore, hasMore } = useIconPicker();
  const { showIconPicker, setShowIconPicker } = useContext(DeviceContext);
  const [myRef, inView] = useInViewRef();

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView]);

  const onSelect = (iconName) => {
    handleAddIcon({ data, mutateKey, iconName });
    setShowIconPicker(false);
  };

  return (
    <Modal
      opened={true}
      onClose={() => setShowIconPicker(false)}
      withCloseButton={false}
      size="xl"
    >
      <SearchFilter
        filter={search}
        onChange={(e) => setSearch(e.target.value)}
        label="Search for an icon"
      />
      <div className="grid grid-cols-6 gap-4 max-h-[60vh] overflow-y-auto overflow-x-hidden">
        {icons.map(({ name }) => {
          return (
            <div
              key={name}
              className="flex flex-col items-center text-xs cursor-pointer hover:opacity-70"
              title={name}
              onClick={() => onSelect(name)}
            >
              <LucideIcon iconName={name} size={24} />
              <span className="truncate w-16 text-center invisible md:visible">
                {name.replace(/([A-Z])/g, " $1").trim()}
              </span>
            </div>
          );
        })}
        {hasMore && <div style={{ height: 100 }} />}
        <div ref={myRef} />
      </div>
    </Modal>
  );
}
