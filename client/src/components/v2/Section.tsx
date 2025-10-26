import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: "white" | "off-white" | "navy";
  spacing?: "default" | "tight" | "loose";
}

export default function Section({
  children,
  className,
  background = "white",
  spacing = "default"
}: SectionProps) {
  const backgrounds = {
    white: "bg-v2-white",
    "off-white": "bg-v2-off-white",
    navy: "bg-v2-navy text-v2-white",
  };

  const spacings = {
    tight: "py-12 sm:py-16",
    default: "py-16 sm:py-20 lg:py-24",
    loose: "py-24 sm:py-32 lg:py-40",
  };

  return (
    <section className={cn(
      backgrounds[background],
      spacings[spacing],
      className
    )}>
      {children}
    </section>
  );
}
