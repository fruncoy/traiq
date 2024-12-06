import React from 'react';
import { cn } from "@/lib/utils";

interface SidebarContainerProps {
  children: React.ReactNode;
  className?: string;
  fixed?: boolean;
}

export const SidebarContainer = ({ children, className, fixed = false }: SidebarContainerProps) => {
  return (
    <div className={cn(
      "min-h-screen bg-white border-r",
      fixed ? "fixed top-0 left-0 h-full w-64" : "relative",
      className
    )}>
      {children}
    </div>
  );
};