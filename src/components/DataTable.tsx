import { LuEllipsisVertical, LuPlus, LuSearch } from "react-icons/lu";

import { debounce } from "@/lib/utils";
import { RequiredPaginationParams } from "@/services/leadService";
import clsx from "clsx";
import { ReactNode } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { Pagination } from "../types/api";
import Button from "./ui/Button";
import Checkbox from "./ui/Checkbox";
import Select from "./ui/Select";

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
  renderKey?: keyof T;
  isLoading: boolean;
  // error: Error | null;
  searchQuery: string;
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

export const generatePagination = (
  currentPage: number,
  pageSize: number,
  totalRecords: number
) => {
  const totalPages = Math.ceil(totalRecords / pageSize);
  const maxButtons = 7;
  const buttons = [];

  if (totalPages === 1) return [];

  const addRange = (start: number, end: number) => {
    for (let i = start; i <= end; i++) {
      buttons.push(i);
    }
  };

  if (totalPages <= maxButtons) {
    addRange(1, totalPages);
  } else {
    if (currentPage <= 4) {
      addRange(1, 5);
      buttons.push("...");
      buttons.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      buttons.push(1);
      buttons.push("...");
      addRange(totalPages - 4, totalPages);
    } else {
      buttons.push(1);
      buttons.push("...");
      addRange(currentPage - 1, currentPage + 1);
      buttons.push("...");
      buttons.push(totalPages);
    }
  }

  return buttons;
};

const pageSizeOptions = [
  { value: "10", label: "10 per page" },
  { value: "25", label: "25 per page" },
  { value: "50", label: "50 per page" },
  { value: "100", label: "100 per page" },
];

const DataTable = <TItem,>(props: Props<TItem>) => {
  const { columns, data = [], renderKey, onSearch } = props;

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

  const handleSearchInput = debounce(onSearch, 450);

  return (
    <div>
      {/* Head starts */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-6">
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
                console.log("e.target ", e.currentTarget.value);
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
        <div className="bg-white rounded-lg border border-[#DBDADD]">
          <table className="w-full">
            <thead className="font-normal border-b border-[#DBDADD]">
              <tr className="px-4 py-1">
                <th className="w-14 py-1.5 pr-2.5">
                  <Checkbox id="select-all" />
                </th>
                {columns.map((col, colIdx) => (
                  <th
                    key={colIdx}
                    className="w-auto font-normal text-left text-xs text-[#646069] py-1.5 pr-2.5"
                  >
                    {col.title}
                  </th>
                ))}
                <th className="w-9 text-left py-1.5"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, itemIdx) => (
                <tr
                  key={getRenderKeyVal(item, renderKey, itemIdx)}
                  className="border-b border-[#DBDADD]"
                >
                  <td className="px-4 py-3">
                    <Checkbox id={`select-item-${itemIdx}`} />
                  </td>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="pr-2.5 py-3">
                      {getRenderer(col)(item[col.dataKey], item, itemIdx)}
                    </td>
                  ))}
                  <td className="w-9 py-3">
                    <div className="flex items-center justify-center size-6 p-1 rounded-full cursor-pointer transition-colors ease-in-out duration-300 hover:bg-gray-200">
                      <LuEllipsisVertical className="text-[#646069] text" />
                    </div>
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
