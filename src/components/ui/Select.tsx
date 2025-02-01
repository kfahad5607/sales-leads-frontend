import {
  Select as BaseSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";

interface Props {
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  selectedValue: string;
  onChange: (value: string) => void;
}

const Select = ({
  label,
  options,
  placeholder,
  selectedValue,
  onChange,
}: Props) => {
  return (
    <BaseSelect value={selectedValue} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder || selectedValue} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </BaseSelect>
  );
};

export default Select;
