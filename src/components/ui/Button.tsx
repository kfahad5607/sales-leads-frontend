import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Variant = "primary" | "outlined-primary";
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  variant?: Variant;
}

const baseStyles =
  "inline-flex items-center gap-2 px-3 py-2 border rounded-lg  transition-all cursor-pointer focus:outline-none";
const variantStyles: Record<Variant, string> = {
  primary: "bg-[#6A1BE0] text-white border-[#6A1BE0] hover:bg-[#6A1BE0]",
  "outlined-primary":
    "bg-white text-[#28272A] border border-[#DBDADD] hover:bg-gray-100",
};

const Button = ({
  children,
  icon,
  variant = "primary",
  className,
  ...props
}: Props) => {
  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span className="font-medium">{children}</span>
    </button>
  );
};

export default Button;
