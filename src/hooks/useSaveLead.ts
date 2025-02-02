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
import { Lead, LeadCreateWithOptId } from "@/types/leads";

// Services
import { AxiosError } from "axios";
import { createLead, updateLead } from "../services/leadService";

// Utilities
import { queryKeys } from "@/lib/utils";

const useSaveLead = (
  paginationParams: PaginationParams,
  filterParams: FilteringParams,
  sortByParams: SortByParams
) => {
  const queryClient = useQueryClient();
  return useMutation<Lead, AxiosError<ErrorResponse>, LeadCreateWithOptId>({
    mutationFn: (data) => {
      if (data.id) {
        // Just to make TSC happy
        const _data = data as Lead;
        return updateLead(_data);
      } else {
        return createLead(data);
      }
    },
    onSuccess: (updatedLead) => {
      const queryKey = queryKeys.leads(
        paginationParams,
        filterParams,
        sortByParams
      );
      queryClient.setQueryData(queryKey, (oldLeads: unknown) => {
        if (!oldLeads) return [];
        const _oldLeads = oldLeads as PaginatedResponse<Lead>;

        _oldLeads.data = _oldLeads.data.map((lead) =>
          lead.id === updatedLead.id ? updatedLead : lead
        );

        return _oldLeads;
      });
    },
    onError: (error) => {
      console.error("Error saving lead:", error);
    },
  });
};

export default useSaveLead;
