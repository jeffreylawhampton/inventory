import { useEffect } from "react";
import { useInViewRef } from "rooks";
import { useIconPicker } from "@/app/hooks/useIconPicker";
import { LucideIcon } from "..";
import { TextInput } from "@mantine/core";
import { inputStyles } from "@/app/lib/styles";
import { Search } from "lucide-react";

export default function IconPicker({ onSelect, height = "h-[40vh]" }) {
  const { search, setSearch, icons, loadMore, hasMore } = useIconPicker();
  const [myRef, inView] = useInViewRef();

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  return (
    <div className={`overflow-hidden ${height} relative`}>
      <div className="bg-white sticky top-0 left-0 w-full h-fit">
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
      <div className="grid grid-cols-6 md:gap-4 gap-y-10 h-[90%] pt-3 pb-12 overflow-x-hidden auto-rows-min">
        {icons.map(({ name }) => {
          return (
            <div
              role="button"
              tabIndex={0}
              key={name}
              className="flex flex-col items-center text-xs cursor-pointer hover:opacity-70"
              title={name}
              onClick={(e) => {
                e.preventDefault();
                onSelect(name);
              }}
            >
              <LucideIcon iconName={name} size={24} />
              <div className="mt-1.5 truncate w-16 text-center invisible md:visible">
                {name.replace(/([A-Z])/g, " $1").trim()}
              </div>
            </div>
          );
        })}
        {hasMore && <div style={{ height: 100 }} />}
        <div ref={myRef} />
      </div>
    </div>
  );
}
