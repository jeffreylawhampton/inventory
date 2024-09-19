"use client";
import { TextInput } from "@mantine/core";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { IconSearch } from "@tabler/icons-react";
import { inputStyles } from "../lib/styles";

export default function Search({ rootClass, wrapperClass }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }
  return (
    <div className={wrapperClass}>
      <TextInput
        radius={inputStyles.radius}
        size="lg"
        leftSection={<IconSearch aria-label="Search" stroke={2} size={20} />}
        classNames={{
          input: inputStyles.inputClasses,
          root: rootClass,
        }}
        className="pb-3"
        variant={inputStyles.variant}
        placeholder={"Search by name, description, or purchase location"}
        aria-label="Search by name, description, or purchase location"
        onChange={(e) => {
          e.preventDefault();
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
    </div>
  );
}
