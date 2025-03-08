
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function GapContainer({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  
  return (
    <div className={`gap-container ${isMobile ? 'px-4' : 'px-8'} w-full max-w-full overflow-x-hidden`}>
      {children}
    </div>
  );
}
