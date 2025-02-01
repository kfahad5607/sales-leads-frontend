export type Pagination = {
  current_page: number;
  page_size: number;
  total_records: number;
  total_pages: number;
};

export type PaginatedResponse<TItem> = Pagination & {
  data: TItem[];
};

export type ErrorResponse = {
  message: string;
};

export type FilteringParams = {
  query?: string;
};

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

export type RequiredPaginationParams = Required<PaginationParams>;

type SortingParamItem = {
  sortBy: string;
  sortOrder: "asc" | "desc";
};
export type SortingParams = SortingParamItem[];
