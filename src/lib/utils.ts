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

export const getInitials = (fullName: string): string => {
  const names = fullName.split(" ");

  const firstInitial = names[0].charAt(0);
  const lastInitial =
    names.length > 1 ? names[names.length - 1].charAt(0) : firstInitial;

  return (firstInitial + lastInitial).toUpperCase();
};
