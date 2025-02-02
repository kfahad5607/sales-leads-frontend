// Types
import {
  FilteringParams,
  PaginatedResponse,
  PaginationParams,
  SortByParams,
} from "../types/api";
import { Lead, LeadCreate } from "../types/leads";

// Services
import apiClient from "./api-client";

export const getLeads = async (
  paginationParams: PaginationParams,
  filterParams: FilteringParams,
  sortByParams: SortByParams
) => {
  const { page = 1, pageSize = 10 } = paginationParams;
  let url = `leads?page=${page}&page_size=${pageSize}`;
  if (filterParams.query) {
    url = `${url}&query=${filterParams.query}`;
  }
  if (sortByParams) {
    url = `${url}&sort_by=${sortByParams}`;
  }

  const res = await apiClient.get<PaginatedResponse<Lead>>(url);

  return res.data;
};

export const exportLeads = async (
  filterParams: FilteringParams,
  sortByParams: SortByParams
) => {
  let url = `leads/export?`;
  if (filterParams.query) {
    url = `${url}&query=${filterParams.query}`;
  }
  if (sortByParams) {
    url = `${url}&sort_by=${sortByParams}`;
  }

  const res = await apiClient.get(url, {
    responseType: "blob",
  });
  console.log("res ", typeof res);

  const blob = new Blob([res.data], { type: "text/csv" });
  const blobUrl = window.URL.createObjectURL(blob);

  // Create an anchor element and trigger the download
  const link = document.createElement("a");
  link.href = blobUrl;
  link.setAttribute("download", "sales_leads.csv");
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);

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
