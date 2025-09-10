import { useEffect } from "react";
import { useInViewRef } from "rooks";
import { useIconPicker } from "@/app/hooks/useIconPicker";
import { LucideIcon } from "..";
import { handleAddIcon } from "@/app/lib/handlers";
import { Button, TextInput } from "@mantine/core";
import { inputStyles } from "@/app/lib/styles";
import { Search } from "lucide-react";

export default function UpdateIcon({
  data,
  item,
  mutateKey,
  additionalMutate,
  close,
  type,
  onSuccess,
  onSelectOverride = null,
}) {
  const { search, setSearch, icons, loadMore, hasMore } = useIconPicker();
  const [myRef, inView] = useInViewRef();

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  const onSelect = (iconName) => {
    if (onSelectOverride) onSelectOverride(iconName);
    else
      handleAddIcon({
        data,
        item,
        type,
        mutateKey,
        iconName,
        additionalMutate,
      });
    onSuccess && onSuccess();
    close();
  };

  return (
    <div className="overflow-hidden h-[80vh] relative">
      <div className="bg-white sticky top-0 left-0 w-full h-fit pb-4">
        <TextInput
          placeholder="Search for an icon"
          size={inputStyles.size}
          radius={inputStyles.radius}
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="default"
          aria-label="Search"
          className="pb-3"
          classNames={{
            input: "textinput",
          }}
          leftSection={<Search size={20} />}
        />
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4 gap-y-8 h-[90%] pb-4 overflow-x-hidden auto-rows-min">
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
      <div className="w-fit fixed bottom-8 !right-8 pt-2 pr-3">
        <Button className="max-w-[180px]" color="black" onClick={close}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
