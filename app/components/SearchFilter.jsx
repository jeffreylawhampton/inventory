"use client";
import { TextInput } from "@mantine/core";
import { Search } from "lucide-react";
import { inputStyles } from "../lib/styles";
import { useContext } from "react";
import { FilterContext } from "../providers";

const SearchFilter = ({
  onChange,
  label,
  classNames,
  size,
  padding = "pb-3",
  roundedFull = false,
  autoFocus = false,
}) => {
  const { filter } = useContext(FilterContext);
  return (
    <TextInput
      placeholder={label}
      size={size ?? inputStyles.size}
      radius={roundedFull ? "xl" : inputStyles.radius}
      name="search"
      value={filter}
      onChange={onChange}
      variant="default"
      autoFocus={autoFocus}
      aria-label="Search"
      className={`${padding} ${classNames} `}
      classNames={{
        input: "textinput focus:!border-black",
      }}
      leftSection={<Search size={20} />}
    />
  );
};

export default SearchFilter;
