// React Query
import { keepPreviousData, useQuery } from "@tanstack/react-query";

// Services
import { getLeads } from "../services/leadService";

// Types
import { FilteringParams, PaginationParams, SortByParams } from "@/types/api";

// Utilities
import { queryKeys } from "@/lib/utils";

const useLeads = (
  paginationParams: PaginationParams,
  filterParams: FilteringParams,
  sortByParams: SortByParams
) => {
  return useQuery({
    queryKey: queryKeys.leads(paginationParams, filterParams, sortByParams),
    queryFn: () => getLeads(paginationParams, filterParams, sortByParams),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useLeads;
