import { queryKeys } from "@/lib/utils";
import { ErrorResponse } from "@/types/api";
import { Lead } from "@/types/leads";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { bulkDeleteLeads } from "../services/leadService";

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
