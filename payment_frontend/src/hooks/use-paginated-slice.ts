import { useMemo, useState } from "react";

const DEFAULT_PAGE_SIZE = 12;

export function usePaginatedSlice<T>(items: T[], pageSize = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(0);
  const pageCount =
    Math.max(1, Math.ceil((items.length || 1) / pageSize)) ?? 1;
  const safePage = Math.min(page, Math.max(pageCount - 1, 0));

  const pageItems = useMemo(() => {
    const start = safePage * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  return {
    page: safePage,
    setPage,
    pageItems,
    pageSize,
    total: items.length,
    pageCount,
    hasPrev: safePage > 0,
    hasNext: safePage < pageCount - 1,
  };
}
