import React from "react";
import { GrFormCheckmark } from "react-icons/gr";

interface Props {
  id: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const Checkbox = ({ id, checked = false, onChange, className = "" }: Props) => {
  return (
    <div className={`inline-block relative ${className}`}>
      <input
        id={id}
        type="checkbox"
        className="peer size-4 border border-gray-300 rounded-sm appearance-none checked:bg-indigo-600 checked:border-indigo-600"
        // checked={checked}
        onChange={onChange}
      />
      <label
        htmlFor={id}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100"
      >
        <GrFormCheckmark className="text-white -mt-1" />
      </label>
    </div>
  );
};

export default Checkbox;
