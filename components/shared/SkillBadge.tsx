import { cva } from "class-variance-authority";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

const renderTagVariants = cva(
  "light:border-none rounded-md bg-cyan-200 uppercase text-cyan-600 dark:border-cyan-600 dark:bg-dark-300",
  {
    variants: {
      size: {
        normal: "subtle-semibold px-4 py-2",
        small: "max-w-[90px] px-3 py-1.5 text-[7pt]",
      },
    },
    defaultVariants: {
      size: "normal",
    },
  }
);

const SkillBadge = ({
  size,
  text,
}: {
  size?: "normal" | "small";
  text: string;
}) => {
  return (
    <Badge className={cn(renderTagVariants({ size }))}>
      <p className="truncate text-nowrap">{text}</p>
    </Badge>
  );
};

export default SkillBadge;
