import { useSearchParams } from "react-router-dom";
import {} from "../services/leadService";
import { PaginationParams, RequiredPaginationParams } from "@/types/api";

export const queryKeys = {
  base: "leads" as const,
  leads: (pagination: PaginationParams) =>
    [queryKeys.base, pagination.page, pagination.pageSize] as const,
};

export const useDatatableSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
  const pageSize = Math.max(parseInt(searchParams.get("pageSize") || "10"), 10);
  const sortBy = searchParams.get("sort_by") || "";

  const updateSearch = (query: string) => {
    setSearchParams(() => {
      const newParams = new URLSearchParams({});

      if (query) {
        newParams.set("query", query);
      } else {
        newParams.delete("query");
      }
      return newParams;
    });
  };

  const updatePagination = (pagination: RequiredPaginationParams) => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set("page", pagination.page.toString());
      newParams.set("pageSize", pagination.pageSize.toString());

      return newParams;
    });
  };

  const updateSort = (sortBy: string) => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set("sort_by", sortBy);

      return newParams;
    });
  };

  return {
    query,
    page,
    pageSize,
    sortBy,
    updateSort,
    updatePagination,
    updateSearch,
  };
};
