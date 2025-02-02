import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getLeads } from "../services/leadService";
import { FilteringParams, PaginationParams, SortingParams } from "@/types/api";
import { queryKeys } from "@/lib/utils";

const useLeads = (
  pagination: PaginationParams,
  filtering: FilteringParams,
  sorting: SortingParams
) => {
  return useQuery({
    queryKey: queryKeys.leads(pagination, filtering, sorting),
    queryFn: () => getLeads(pagination, filtering, sorting),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useLeads;
