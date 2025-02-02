import { cn } from "@/lib/utils";

interface Props {
  totalBars: number;
  filledBars: number;
  className?: string;
}

function generateArray(n: number) {
  return Array.from({ length: n }, (_, i) => i + 1);
}

const ProgressBar = ({ totalBars, filledBars, className = "h-4" }: Props) => {
  return (
    <div className={cn("inline-flex gap-x-0.5", className)}>
      {generateArray(totalBars).map((j) => (
        <div
          key={j}
          className={cn(
            "w-1 h-full rounded-sm",
            j <= filledBars ? "bg-[#7B2FF8]" : "bg-[#DBDADD]"
          )}
        ></div>
      ))}
    </div>
  );
};

export default ProgressBar;
