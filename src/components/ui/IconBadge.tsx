import clsx from "clsx";
import { IconType } from "react-icons";

type Variant = "green" | "gray";
interface Props {
  label: string;
  Icon: IconType;
  variant?: Variant;
}

const variantStyles: Record<
  Variant,
  { bgColor: string; textColor: string; borderColor: string }
> = {
  green: {
    bgColor: "bg-[#F2FCF1]",
    textColor: "text-[#1B851B]",
    borderColor: "border-[#DEFBDD]",
  },
  gray: {
    bgColor: "bg-[#F7F7F8]",
    textColor: "text-[#646069]",
    borderColor: "border-[#DBDADD]",
  },
};

const IconBadge = ({ label, variant = "green", Icon }: Props) => {
  const { bgColor, textColor, borderColor } = variantStyles[variant];

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-x-1 py-[1px] px-1.5 font-medium text-xs rounded-sm border",
        bgColor,
        textColor,
        borderColor
      )}
    >
      <Icon className="text-[11px]" />
      <span>{label}</span>
    </div>
  );
};

export default IconBadge;
