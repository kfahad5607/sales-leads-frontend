import {
  ErrorResponse,
  FilteringParams,
  PaginatedResponse,
  PaginationParams,
  SortingParams,
} from "@/types/api";
import { Lead, LeadCreateWithOptId } from "@/types/leads";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { createLead, updateLead } from "../services/leadService";
import { queryKeys } from "@/lib/utils";

export const useSaveLead = (
  pagination: PaginationParams,
  filtering: FilteringParams,
  sorting: SortingParams
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
      const queryKey = queryKeys.leads(pagination, filtering, sorting);
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
