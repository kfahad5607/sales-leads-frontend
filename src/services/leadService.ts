import { PaginatedResponse } from "../types/api";
import { Lead } from "../types/leads";
import apiClient from "./api-client";

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

type SortingParamItem = {
  sortBy: string;
  sortOrder: "asc" | "desc";
};
export type SortingParams = SortingParamItem[];

export const getLeads = async (
  pagination: PaginationParams,
  sorting: SortingParams
) => {
  const { page = 1, pageSize = 10 } = pagination;
  let url = `leads?page=${page}&page_size=${pageSize}`;

  const res = await apiClient.get<PaginatedResponse<Lead>>(url);
  console.log("RES ", res);

  return res.data;
};
