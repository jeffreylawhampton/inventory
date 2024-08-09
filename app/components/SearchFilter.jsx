"use client";
import { Input } from "@nextui-org/react";

const SearchFilter = ({ onChange, label, filter }) => {
  return (
    <Input
      placeholder={`Search for a ${label}`}
      size="lg"
      name="search"
      value={filter}
      onChange={onChange}
      aria-label="Search"
      className="pb-6"
    />
  );
};

export default SearchFilter;
