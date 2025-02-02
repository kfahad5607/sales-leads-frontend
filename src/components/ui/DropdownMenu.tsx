import { ReactNode } from "react";
import {
  DropdownMenu as BaseDropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./shadcn/dropdown-menu";

interface Props {
  label: string;
  options: { value: string; label: string }[];
  triggerBtn: ReactNode;
  onSelect: (value: string) => void;
}

const DropdownMenu = ({ triggerBtn, label, options, onSelect }: Props) => (
  <BaseDropdownMenu>
    <DropdownMenuTrigger asChild>{triggerBtn}</DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>{label}</DropdownMenuLabel>
      {options.map((option, optionIdx) => (
        <DropdownMenuItem
          key={optionIdx}
          onClick={() => onSelect(option.value)}
        >
          {option.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </BaseDropdownMenu>
);

export default DropdownMenu;
