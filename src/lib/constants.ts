import { Pagination } from "@/types/api";

export const DEFAULT_PAGINATION: Pagination = {
  current_page: 1,
  page_size: 10,
  total_pages: 1,
  total_records: 1,
} as const;
