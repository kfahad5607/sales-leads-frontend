import { FilteringParams, PaginationParams, SortByParams } from "@/types/api";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const debounce = <TFunc extends (...args: any[]) => void>(
  func: TFunc,
  wait: number
) => {
  // To make TSC happy
  let timeout = setTimeout(() => {}, 0);

  return (...args: Parameters<TFunc>) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

export const formatDateToLocal = (inputDate: string): string => {
  const date = new Date(inputDate);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  return date.toLocaleDateString("en-GB", options); // 'en-GB' for "day month year"
};

export const capitalize = (str: string): string => {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const generateArray = (n: number): number[] => {
  return Array.from({ length: n }, (_, index) => index + 1);
};

export const getInitials = (fullName: string): string => {
  const names = fullName.split(" ");

  const firstInitial = names[0].charAt(0);
  const lastInitial =
    names.length > 1 ? names[names.length - 1].charAt(0) : firstInitial;

  return (firstInitial + lastInitial).toUpperCase();
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


export const queryKeys = {
  base: "leads" as const,
  leads: (
    pagination: PaginationParams,
    filtering: FilteringParams,
    sorting: SortByParams
  ) => {
    return [
      queryKeys.base,
      pagination.page,
      pagination.pageSize,
      filtering.query,
      sorting,
    ] as const;
  },
};
