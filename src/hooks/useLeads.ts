import { useQuery } from "@tanstack/react-query";
import {
  getLeads,
  PaginationParams,
  SortingParams,
} from "../services/leadService";

export const queryKeys = {
  base: "venues" as const,
  venues: (query: string, page: number) =>
    [queryKeys.base, query, page] as const,
  venue: (id: number) => [queryKeys.base, id] as const,
  seriesVenues: (id: number) => ["seriesVenues", id] as const,
};

export const useLeads = (
  pagination: PaginationParams,
  sorting: SortingParams
) => {
  return useQuery({
    queryKey: ["leads"],
    queryFn: () => getLeads(pagination, sorting),
    retry: 0,
  });
};
