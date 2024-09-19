import { useState } from "react";
import {
  PillsInput,
  Pill,
  Combobox,
  CheckIcon,
  Group,
  useCombobox,
} from "@mantine/core";
import { checkLuminance } from "../lib/helpers";

export default function MultiSelect({
  categories,
  colSpan = 3,
  setItem,
  item,
  inputStyles,
  variant,
}) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });
  const [search, setSearch] = useState("");

  const handleValueSelect = (val) => {
    if (item.categories?.some((category) => category == val.id)) {
      setItem({
        ...item,
        categories: item.categories.filter((category) => category != val.id),
      });
    } else
      setItem({
        ...item,
        categories: item?.categories?.length
          ? [...item.categories, val.id]
          : [val.id],
      });
  };

  const handleValueRemove = (val) => {
    setItem({
      ...item,
      categories: item.categories.filter((category) => category != val),
    });
  };

  const values = item?.categories?.map((category) => {
    const cat = categories.find((cat) => cat.id == category);

    return (
      <Pill
        styles={{
          root: {
            backgroundColor: cat?.color?.hex,
            color: cat?.color?.hex ? checkLuminance(cat.color.hex) : "black",
          },
        }}
        classNames={{
          label: "font-semibold px-1 text-[13px]",
        }}
        key={cat.name}
        withRemoveButton
        onRemove={() => handleValueRemove(cat.id)}
      >
        {cat.name}
      </Pill>
    );
  });

  const options = categories
    ?.filter((category) =>
      category?.name?.toLowerCase()?.includes(search.trim().toLowerCase())
    )
    .map((category) => {
      const active = item?.categories?.includes(category.id);
      return (
        <Combobox.Option value={category} key={category.name} active={active}>
          <Group gap="sm">
            {active ? <CheckIcon size={12} /> : null}
            <span>{category?.name}</span>
          </Group>
        </Combobox.Option>
      );
    });

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={handleValueSelect}
      className={`col-span-3`}
    >
      <Combobox.DropdownTarget>
        <PillsInput
          onClick={() => combobox.openDropdown()}
          size="lg"
          label="Categories"
          variant={inputStyles.variant}
          radius={inputStyles?.radius}
          classNames={{
            label: inputStyles.labelClasses,
          }}
        >
          <Pill.Group gap="6">
            {values}

            <Combobox.EventsTarget>
              <PillsInput.Field
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                value={search}
                placeholder="Search for a category"
                onChange={(event) => {
                  combobox.updateSelectedOptionIndex();
                  setSearch(event.currentTarget.value);
                }}
                onKeyDown={(event) => {
                  if (
                    event.key === "Backspace" &&
                    search.length === 0 &&
                    item?.categories?.length
                  ) {
                    event.preventDefault();
                    handleValueRemove(
                      item?.categories[item?.categories?.length - 1]
                    );
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options?.length > 0 ? (
            options
          ) : (
            <Combobox.Empty>Nothing found...</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
