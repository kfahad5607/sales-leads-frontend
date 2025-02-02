import {
  Select as BaseSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { forwardRef } from "react";

interface Props {
  label?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  selectedValue: string;
  onChange: (value: string) => void;
}

const Select = forwardRef<HTMLButtonElement, Props>(
  ({ label, options, placeholder, selectedValue, onChange }: Props, ref) => {
    return (
      <BaseSelect value={selectedValue} onValueChange={onChange}>
        <SelectTrigger ref={ref}>
          <SelectValue placeholder={placeholder || selectedValue} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {label && <SelectLabel>{label}</SelectLabel>}
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </BaseSelect>
    );
  }
);
Select.displayName = "Select";

export default Select;
