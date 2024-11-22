import { useLocation } from "react-router-dom";
import { SidebarNavProps } from "./types";

export const SidebarNav = ({ children }: SidebarNavProps) => {
  return (
    <nav className="p-4 space-y-1">
      {children}
    </nav>
  );
};