export type Pagination = {
  current_page: number;
  page_size: number;
  total_records: number;
  total_pages: number;
};

export type PaginatedResponse<TItem> = Pagination & {
  data: TItem[];
};
