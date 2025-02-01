import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getLeads,
  PaginationParams,
  SortingParams,
} from "../services/leadService";

export const queryKeys = {
  base: "leads" as const,
  leads: (pagination: PaginationParams) =>
    [queryKeys.base, pagination.page, pagination.pageSize] as const,
};

export const useLeads = (
  pagination: PaginationParams,
  sorting: SortingParams
) => {
  return useQuery({
    queryKey: queryKeys.leads(pagination),
    queryFn: () => getLeads(pagination, sorting),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
