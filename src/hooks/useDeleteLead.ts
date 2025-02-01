import {
  ErrorResponse,
  FilteringParams,
  PaginatedResponse,
  PaginationParams,
  SortingParams,
} from "@/types/api";
import { Lead } from "@/types/leads";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { deleteLead } from "../services/leadService";
import { queryKeys } from "@/lib/utils";

export const useDeleteLead = (
  pagination: PaginationParams,
  filtering: FilteringParams,
  sorting: SortingParams
) => {
  const queryClient = useQueryClient();
  return useMutation<{}, AxiosError<ErrorResponse>, Lead["id"]>({
    mutationFn: deleteLead,
    onSuccess: (_, leadId) => {
      console.log("leadIdleadIdleadIdleadId ", leadId);

      const queryKey = queryKeys.leads(pagination, filtering, sorting);
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
