// React Query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Types
import {
  ErrorResponse,
  FilteringParams,
  PaginatedResponse,
  PaginationParams,
  SortByParams,
} from "@/types/api";
import { Lead } from "@/types/leads";

// Services
import { AxiosError } from "axios";
import { deleteLead } from "../services/leadService";

// Utilities
import { queryKeys } from "@/lib/utils";

const useDeleteLead = (
  paginationParams: PaginationParams,
  filterParams: FilteringParams,
  sortByParams: SortByParams
) => {
  const queryClient = useQueryClient();
  return useMutation<{}, AxiosError<ErrorResponse>, Lead["id"]>({
    mutationFn: deleteLead,
    onSuccess: (_, leadId) => {
      const queryKey = queryKeys.leads(
        paginationParams,
        filterParams,
        sortByParams
      );
      queryClient.setQueryData(queryKey, (oldLeads: unknown) => {
        if (!oldLeads) return [];
        const _oldLeads = oldLeads as PaginatedResponse<Lead>;
        _oldLeads.data = _oldLeads.data.filter((lead) => lead.id !== leadId);
        return _oldLeads;
      });
    },
    onError: (error) => {
      console.error("Error deleting lead:", error);
    },
  });
};

export default useDeleteLead;
