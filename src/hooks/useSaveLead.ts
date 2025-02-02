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
    onSuccess: (savedLead, newLead) => {
      const queryKey = queryKeys.leads(
        paginationParams,
        filterParams,
        sortByParams
      );

      if (newLead.id) {
        queryClient.setQueryData(queryKey, (oldLeads: unknown) => {
          if (!oldLeads) return [];
          const _oldLeads = oldLeads as PaginatedResponse<Lead>;

          _oldLeads.data = _oldLeads.data.map((lead) =>
            lead.id === savedLead.id ? savedLead : lead
          );

          return _oldLeads;
        });
      } else {
        queryClient.setQueryData(queryKey, (oldLeads: unknown) => {
          if (!oldLeads) return [];
          const _oldLeads = oldLeads as PaginatedResponse<Lead>;
          _oldLeads.data = [savedLead, ..._oldLeads.data];

          return _oldLeads;
        });
      }
    },
    onError: (error) => {
      console.error("Error saving lead:", error);
    },
  });
};

export default useSaveLead;
