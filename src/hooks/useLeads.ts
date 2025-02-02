import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getLeads } from "../services/leadService";
import { FilteringParams, PaginationParams, SortByParams } from "@/types/api";
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
