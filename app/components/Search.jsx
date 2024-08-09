"use client";
import { Input } from "@nextui-org/react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Search as MagnifyingGlass } from "lucide-react";

export default function Search({ placeholder }) {
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
    <Input
      className="rounded-sm pb-6"
      size="lg"
      classNames={{ input: "text-slate-500" }}
      startContent={
        <MagnifyingGlass strokeWidth={3} className="text-slate-500 w-4" />
      }
      placeholder={"Search by name, description, or purchase location"}
      aria-label="Search by name, description, or purchase location"
      onChange={(e) => {
        handleSearch(e.target.value);
      }}
      defaultValue={searchParams.get("query")?.toString()}
    />
  );
}
