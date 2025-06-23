import { useMemo, useState } from "react";
import { lucideIconList } from "../../lib/LucideIconList";

export const useIconPicker = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 60;

  const filteredEntries = useMemo(() => {
    return Object.entries(lucideIconList).filter(([name]) =>
      name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const icons = useMemo(() => {
    return filteredEntries
      .slice(0, page * pageSize)
      .map(([name, Component]) => ({
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
    search,
    setSearch,
    icons,
    loadMore,
    hasMore: page * pageSize < filteredEntries.length,
  };
};
