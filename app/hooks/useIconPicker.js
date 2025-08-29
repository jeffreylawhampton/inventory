import { useMemo, useState, useContext } from "react";
import { lucideIconList } from "../../lib/LucideIconList";
import { FilterContext } from "../providers";

export const useIconPicker = () => {
  const { filter, setFilter } = useContext(FilterContext);
  // const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 60;

  const filteredEntries = useMemo(() => {
    return Object.entries(lucideIconList).filter(([name, { tags }]) => {
      const lowerSearch = filter.toLowerCase();
      return (
        name.toLowerCase().includes(lowerSearch) ||
        tags?.some((tag) => tag.toLowerCase().includes(lowerSearch))
      );
    });
  }, [filter]);

  const icons = useMemo(() => {
    return filteredEntries
      .slice(0, page * pageSize)
      .map(([name, { Component }]) => ({
        name,
        Component,
      }));
  }, [filteredEntries, page]);

  const loadMore = () => {
    if (page * pageSize < filteredEntries.length) {
      setPage((prev) => prev + 1);
    }
  };

  return {
    filter,
    setFilter,
    icons,
    loadMore,
    hasMore: page * pageSize < filteredEntries.length,
  };
};
