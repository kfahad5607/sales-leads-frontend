import {
  FilteringParams,
  PaginatedResponse,
  PaginationParams,
  SortingParams,
} from "../types/api";
import { Lead, LeadCreate } from "../types/leads";
import apiClient from "./api-client";

export const getLeads = async (
  pagination: PaginationParams,
  filtering: FilteringParams,
  sorting: SortingParams
) => {
  const { page = 1, pageSize = 10 } = pagination;
  let url = `leads?page=${page}&page_size=${pageSize}`;
  if (filtering.query) {
    url = `${url}&query=${filtering.query}`;
  }
  const sortKey = sorting.map((sortItem) => {
    let prefix = sortItem.sortOrder === "desc" ? "-" : "";

    return `${prefix}${sortItem.sortBy}`;
  });
  console.log("sortKey ", sortKey);

  const res = await apiClient.get<PaginatedResponse<Lead>>(url);

  return res.data;
};

export const createLead = async (lead: LeadCreate): Promise<Lead> => {
  const response = await apiClient.post("leads", lead);
  return response.data;
};

export const updateLead = async (
  lead: Omit<Lead, "created_at" | "updated_at">
): Promise<Lead> => {
  const response = await apiClient.put(`leads/${lead.id}`, lead);
  return response.data;
};

export const deleteLead = async (leadId: Lead["id"]): Promise<Lead> => {
  const response = await apiClient.delete(`leads/${leadId}`);
  return response.data;
};

export const bulkDeleteLeads = async (leadIds: Lead["id"][]): Promise<Lead> => {
  const response = await apiClient.post("leads/bulk-delete", { ids: leadIds });
  return response.data;
};
