import React from 'react';
import { cn } from "@/lib/utils";

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
  hasSidebar?: boolean;
}

export const MainContent = ({ children, className, hasSidebar = true }: MainContentProps) => {
  return (
    <main className={cn(
      "min-h-screen p-6 overflow-y-auto",
      hasSidebar ? "ml-64" : "",
      className
    )}>
      {children}
    </main>
  );
};