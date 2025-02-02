import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getLeads } from "../services/leadService";
import { FilteringParams, PaginationParams, SortByParams } from "@/types/api";
import { queryKeys } from "@/lib/utils";

const useLeads = (
  pagination: PaginationParams,
  filtering: FilteringParams,
  sortBy: SortByParams
) => {
  return useQuery({
    queryKey: queryKeys.leads(pagination, filtering, sortBy),
    queryFn: () => getLeads(pagination, filtering, sortBy),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useLeads;
