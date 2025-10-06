import { useContext } from "react";
import { Pill, PillGroup } from "@mantine/core";
import { CircleCheck } from "lucide-react";
import { FilterContext } from "../providers";

const Sort = () => {
  const { sortType, setSortType, sortDirection, setSortDirection } =
    useContext(FilterContext);

  const sortTypes = [
    { value: "name", label: "Name" },
    { value: "createdAt", label: "Created on" },
    { value: "updatedAt", label: "Updated on" },
  ];

  const labelClasses = "flex items-center justify-start gap-1 !text-sm";
  const selectedClasses =
    "!bg-white border dropshadow !pl-0.5 border-bluegray-100";
  const unselectedClasses = "!bg-white border opacity-50 border-bluegray-400";

  return (
    <div className="px-4 pb-4">
      <PillGroup>
        {sortTypes?.map(({ label, value }) => {
          const selected = sortType === value;
          return (
            <Pill
              key={value}
              size="lg"
              classNames={{
                label: labelClasses,
                root: selected ? selectedClasses : unselectedClasses,
              }}
              onClick={() => setSortType(value)}
            >
              {selected ? (
                <CircleCheck fill="black" stroke="white" size={26} />
              ) : null}
              {label}
            </Pill>
          );
        })}
      </PillGroup>
      <h2 className="font-semibold text-md mb-2 mt-6">Direction</h2>
      <PillGroup>
        <Pill
          size="lg"
          classNames={{
            label: labelClasses,
            root: sortDirection ? unselectedClasses : selectedClasses,
          }}
          onClick={() => setSortDirection(0)}
        >
          {!sortDirection ? (
            <CircleCheck fill="black" stroke="white" size={26} />
          ) : null}
          Ascending
        </Pill>
        <Pill
          size="lg"
          classNames={{
            label: labelClasses,
            root: sortDirection ? selectedClasses : unselectedClasses,
          }}
          onClick={() => setSortDirection(1)}
        >
          {sortDirection ? (
            <CircleCheck fill="black" stroke="white" size={26} />
          ) : null}
          Descending
        </Pill>
      </PillGroup>
    </div>
  );
};

export default Sort;
