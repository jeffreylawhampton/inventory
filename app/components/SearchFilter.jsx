"use client";
import { Input } from "@nextui-org/react";
import { Search } from "lucide-react";

const SearchFilter = ({ onChange, label, filter, classNames }) => {
  return (
    <Input
      placeholder={label}
      size="lg"
      name="search"
      value={filter}
      onChange={onChange}
      aria-label="Search"
      className={`pb-6 ${classNames}`}
      startContent={<Search size={16} />}
    />
  );
};

export default SearchFilter;
