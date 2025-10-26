import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "default" | "narrow" | "wide";
}

export default function Container({
  children,
  className,
  maxWidth = "default"
}: ContainerProps) {
  const widths = {
    narrow: "max-w-4xl",
    default: "max-w-7xl",
    wide: "max-w-[1400px]",
  };

  return (
    <div className={cn(
      "container mx-auto px-4 sm:px-6 lg:px-8",
      widths[maxWidth],
      className
    )}>
      {children}
    </div>
  );
}
