"use client";
import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { inputStyles } from "../lib/styles";

const SearchFilter = ({
  onChange,
  label,
  filter,
  classNames,
  size,
  padding = "pb-3",
}) => {
  return (
    <TextInput
      placeholder={label}
      size={size ?? inputStyles.size}
      radius={inputStyles.radius}
      name="search"
      value={filter}
      onChange={onChange}
      variant="default"
      aria-label="Search"
      className={`${padding} ${classNames} w-full`}
      classNames={{
        input: "textinput",
      }}
      leftSection={<IconSearch aria-label="Search" stroke={2} size={20} />}
    />
  );
};

export default SearchFilter;
