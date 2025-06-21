import { useEffect } from "react";
import { useInViewRef } from "rooks";
import { useIconPicker } from "@/app/hooks/useIconPicker";
import LucideIcon from "../LucideIcon";
import SearchFilter from "../SearchFilter";
import { handleAddIcon } from "@/app/lib/handlers";
import { Button } from "@mantine/core";

export default function UpdateIcon({
  data,
  mutateKey,
  additionalMutate,
  close,
  type,
  onSuccess,
}) {
  const { search, setSearch, icons, loadMore, hasMore } = useIconPicker();
  const [myRef, inView] = useInViewRef();

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView]);

  const onSelect = (iconName) => {
    handleAddIcon({ data, type, mutateKey, iconName, additionalMutate });
    onSuccess && onSuccess();
    close();
  };

  return (
    <div className="overflow-hidden h-[80vh] relative">
      <div className="bg-white sticky top-0 left-0 w-full h-fit pb-4">
        <SearchFilter
          filter={search}
          onChange={(e) => setSearch(e.target.value)}
          label="Search for an icon"
        />
      </div>
      <div className="grid grid-cols-6 gap-4 gap-y-8 h-[90%] overflow-x-hidden">
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
      <Button className="absolute bottom-2 !ml-auto" onClick={close}>
        Cancel
      </Button>
    </div>
  );
}
