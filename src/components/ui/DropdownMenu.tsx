import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu as BaseDropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./shadcn/dropdown-menu";
import { Button } from "./shadcn/button";
import { LuEllipsisVertical } from "react-icons/lu";
import { ReactNode } from "react";

interface Props {
  label: string;
  options: { value: string; label: string }[];
  triggerBtn: ReactNode;
  onSelect: (value: string) => void;
  onClose: () => void;
}

const DropdownMenu = ({
  triggerBtn,
  label,
  options,
  onSelect,
  onClose,
}: Props) => (
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
