
import React from "react";
import { cn } from "@/lib/utils";

interface RainbowTextProps {
  children: React.ReactNode;
  className?: string;
}

export function RainbowText({ children, className }: RainbowTextProps) {
  return (
    <span className={cn("rainbow-text", className)}>
      {children}
    </span>
  );
}
