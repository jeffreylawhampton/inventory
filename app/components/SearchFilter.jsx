"use client";
import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { inputStyles } from "../lib/styles";

const SearchFilter = ({ onChange, label, filter, classNames }) => {
  return (
    <TextInput
      placeholder={label}
      size={inputStyles.size}
      radius={inputStyles.radius}
      name="search"
      value={filter}
      variant={inputStyles.variant}
      onChange={onChange}
      aria-label="Search"
      className={`pb-3 ${classNames} w-full`}
      classNames={{
        input: inputStyles.inputClasses.concat("!font-medium"),
      }}
      leftSection={<IconSearch aria-label="Search" stroke={2} size={20} />}
    />
  );
};

export default SearchFilter;
