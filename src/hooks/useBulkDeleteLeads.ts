// React Query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Types
import { ErrorResponse } from "@/types/api";
import { Lead } from "@/types/leads";

// Services
import { AxiosError } from "axios";
import { bulkDeleteLeads } from "../services/leadService";

// Utilities
import { queryKeys } from "@/lib/utils";

export const useBulkDeleteLeads = () => {
  const queryClient = useQueryClient();
  return useMutation<{}, AxiosError<ErrorResponse>, Lead["id"][]>({
    mutationFn: bulkDeleteLeads,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.base],
      });
    },
    onError: (error) => {
      console.error("Error deleting lead:", error);
    },
  });
};
