import Button from "@/components/ui/Button";
import { Button as ButtonShadcn } from "@/components/ui/shadcn/button";
import { debounce, generatePagination } from "@/lib/utils";
import clsx from "clsx";
import { ReactNode } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import { LuEllipsisVertical, LuPlus, LuSearch } from "react-icons/lu";
import { Pagination, RequiredPaginationParams } from "../types/api";
import DropdownMenu from "@/components/ui/DropdownMenu";
import Select from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/shadcn/checkbox";

interface Column<T> {
  title: string;
  dataKey: keyof T;
  render?: (
    val: T[Column<T>["dataKey"]],
    record: T,
    index: number
  ) => ReactNode;
}

type BaseProps<T> = {
  columns: Column<T>[];
  data: T[] | undefined;
  idKey: keyof T;
  isLoading: boolean;
  // error: Error | null;
  searchQuery: string;
  selectedRowIds: Set<unknown>;
  sortKeys: string[];
  onSort: (colKey: keyof T, isMultiMode: boolean) => void;
  onRowSelect: (data: T, selection: boolean) => void;
  onAllRowSelect: (selection: boolean) => void;
  onEdit: (data: T) => void;
  onDelete: (data: T) => void;
  onBulkDelete: () => void;
  onSearch: (query: string) => void;
};

type Props<T> =
  | (BaseProps<T> & {
      pagination: Pagination;
      onPagination: (pagination: RequiredPaginationParams) => void;
    })
  | BaseProps<T>;

const defaultColumnRender = (val: any) => <>{val}</>;

const getRenderer = <T,>(column: Column<T>) =>
  column.render || defaultColumnRender;

const getRenderKeyVal = <T,>(
  item: T,
  key: keyof T | undefined,
  defaultVal: number
) => {
  if (key === undefined) return defaultVal;
  return JSON.stringify(item[key]);
};

const pageSizeOptions = [
  { value: "10", label: "10 per page" },
  { value: "25", label: "25 per page" },
  { value: "50", label: "50 per page" },
  { value: "100", label: "100 per page" },
];

const rowActionOptions = [
  { value: "edit", label: "Edit" },
  { value: "delete", label: "Delete" },
];

const DataTable = <TItem,>(props: Props<TItem>) => {
  const {
    columns,
    data = [],
    idKey,
    selectedRowIds,
    sortKeys,
    onSort,
    onRowSelect,
    onAllRowSelect,
    onSearch,
    onEdit,
    onDelete,
    onBulkDelete,
  } = props;

  let pagination: Pagination | null = null;
  let onPagination = (pagination: RequiredPaginationParams) => {};
  let paginationButtons: (string | number)[] = [];
  let lastPage = 10;
  let firstRecord = 1;
  let lastRecord = 10;

  if ("pagination" in props) {
    pagination = props.pagination;
    onPagination = props.onPagination;

    paginationButtons = generatePagination(
      pagination.current_page,
      pagination.page_size,
      pagination.total_records
    );

    if (paginationButtons.length > 0) {
      lastPage = Math.ceil(pagination.total_records / pagination.page_size);
      firstRecord = (pagination.current_page - 1) * pagination.page_size + 1;
      lastRecord = pagination.current_page * pagination.page_size;
      lastRecord = Math.min(lastRecord, pagination.total_records);
    } else {
      pagination = null;
    }
  }

  const handlePageClick = (page: number | string) => {
    if (typeof page === "string") return;
    onPagination({
      page,
      pageSize: pagination!.page_size,
    });
  };

  const handlePageSize = (pageSize: string) => {
    onPagination({
      page: pagination!.current_page,
      pageSize: parseInt(pageSize),
    });
  };

  const onRowActionSelect = (action: string, row: TItem) => {
    if (action === "edit") {
      onEdit(row);
    } else if (action === "delete") {
      onDelete(row);
    }
  };

  const isAllSelected = () => {
    return selectedRowIds.size === data.length;
  };

  const isSomeSelected = () => {
    return !isAllSelected() && isAtleastOneSelected();
  };

  const isAtleastOneSelected = () => {
    return selectedRowIds.size > 0;
  };

  const handleSearchInput = debounce(onSearch, 450);

  return (
    <div>
      {/* Head starts */}
      <div className="mb-4">
        <div className="hidden justify-between items-center mb-6">
          <div className="text-3xl font-semibold leading-10 font-fraunces">
            Leads
          </div>
          <div className="flex gap-x-3">
            <Button icon={<LuPlus />} variant="outlined-primary">
              Add Lead
            </Button>
            <Button icon={<LuPlus />}>Export All</Button>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-x-2 border border-[#DBDADD] px-3 py-2 bg-white rounded-lg">
            <LuSearch className="fill-gray-100 text-gray-600 text-xl" />
            <input
              type="search"
              onChange={(e) => {
                const val = e.currentTarget.value.trim();
                handleSearchInput(val);
              }}
              placeholder="Search by lead's name, email or company name"
              className="w-full placeholder:text-sm outline-none"
            />
          </div>
        </div>
      </div>
      {/* Head ends */}
      <div>
        {pagination && (
          <div className="font-medium text-xs text-[#646069] mb-2">
            Showing {firstRecord}-{lastRecord} of {pagination.total_records}{" "}
            leads
          </div>
        )}
        <div className="relative bg-white rounded-lg border border-[#DBDADD]">
          {isAtleastOneSelected() && (
            <div className="flex items-center h-9 bg-white px-2 absolute top-0 left-10 right-0">
              <ButtonShadcn onClick={onBulkDelete} variant="link" size="sm">
                Bulk Delete
              </ButtonShadcn>
            </div>
          )}
          <table className="w-full">
            <thead className="font-normal border-b border-[#DBDADD]">
              <tr className="px-4 py-1">
                <th className="w-14 py-1.5 pr-2.5">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      id="select-all"
                      checked={
                        isAllSelected() || (isSomeSelected() && "indeterminate")
                      }
                      onCheckedChange={() => onAllRowSelect(isAllSelected())}
                    />
                  </div>
                </th>
                {columns.map((col, colIdx) => (
                  <th
                    key={colIdx}
                    onClick={(e) => onSort(col.dataKey, e.ctrlKey || e.metaKey)}
                    className="w-auto font-normal text-left text-xs text-[#646069] py-2.5 pr-2.5 cursor-pointer transition-colors duration-200 ease-out hover:bg-slate-100"
                  >
                    <div className="flex items-center">
                      <span>{col.title}</span>
                      {getColSortIndicator(sortKeys, col.dataKey)}
                    </div>
                  </th>
                ))}
                <th className="w-9 text-left py-1.5"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, itemIdx) => (
                <tr
                  key={getRenderKeyVal(item, idKey, itemIdx)}
                  className="border-b border-[#DBDADD]"
                >
                  <td className="px-4 py-3">
                    <Checkbox
                      id={`select-item-${itemIdx}`}
                      checked={selectedRowIds.has(item[idKey])}
                      onCheckedChange={(val) => onRowSelect(item, Boolean(val))}
                    />
                  </td>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="pr-2.5 py-3">
                      {getRenderer(col)(item[col.dataKey], item, itemIdx)}
                    </td>
                  ))}
                  <td className="w-9 py-3">
                    <DropdownMenu
                      triggerBtn={
                        <div className="flex items-center justify-center size-6 p-1 rounded-full cursor-pointer transition-colors ease-in-out duration-300 hover:bg-gray-200">
                          <LuEllipsisVertical className="text-[#646069] text" />
                        </div>
                      }
                      label="Actions"
                      options={rowActionOptions}
                      onSelect={(val) => {
                        onRowActionSelect(val, item);
                      }}
                      onClose={() => {}}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pagination && (
            <div className="flex justify-between items-center py-2 px-2">
              <div>
                <Select
                  label="Select page size"
                  selectedValue={pagination.page_size.toString()}
                  options={pageSizeOptions}
                  onChange={handlePageSize}
                />
              </div>
              <nav className="flex gap-x-2">
                <button
                  type="button"
                  onClick={() => handlePageClick(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="w-9 h-8 flex justify-center items-center rounded-lg bg-[#F7F7F8] text-[#646069] cursor-pointer transition-colors ease-out duration-200 hover:enabled:bg-gray-200 disabled:text-[#96949C] disabled:pointer-events-none"
                >
                  <BsChevronLeft />
                </button>
                <div className="flex gap-x-0.5 text-sm">
                  {paginationButtons.map((btn, btnIdx) => (
                    <button
                      type="button"
                      key={btnIdx}
                      onClick={() => handlePageClick(btn)}
                      className={clsx(
                        "flex justify-center items-center size-8 rounded-lg cursor-pointer select-none transition-colors ease-out duration-200",
                        getPaginationBtnClass(pagination.current_page, btn)
                      )}
                    >
                      {btn}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handlePageClick(pagination.current_page + 1)}
                  disabled={pagination.current_page === lastPage}
                  className="w-9 h-8 flex justify-center items-center rounded-lg bg-[#F7F7F8] text-[#646069] cursor-pointer transition-colors ease-out duration-200 hover:enabled:bg-gray-200 disabled:text-[#96949C] disabled:pointer-events-none"
                >
                  <BsChevronRight />
                </button>
              </nav>
              <div></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getColSortIndicator = (sortKeys: string[], colKey: unknown) => {
  if (sortKeys.includes(`${colKey}`)) {
    return (
      <div className="ml-1.5 mt-1 align-middle">
        <FaSortUp />
      </div>
    );
  } else if (sortKeys.includes(`-${colKey}`)) {
    return (
      <div className="ml-1.5 mb-1 align-middle">
        <FaSortDown />
      </div>
    );
  }

  return null;
};

const getPaginationBtnClass = (
  currentPage: number,
  btnContent: number | string
) => {
  if (currentPage === btnContent) {
    return "bg-[#6A1BE0] text-white";
  } else if (btnContent === "...") {
    return "pointer-events-none";
  }

  return "bg-gray-50 text-[#28272A] hover:bg-gray-100";
};

export default DataTable;
