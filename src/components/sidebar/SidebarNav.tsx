import { useLocation } from "react-router-dom";
import { SidebarLink } from "./SidebarLink";
import { LinkItem } from "./types";

interface SidebarNavProps {
  links: LinkItem[];
}

export const SidebarNav = ({ links }: SidebarNavProps) => {
  const location = useLocation();
  
  return (
    <nav className="p-4 space-y-1">
      {links.map((link) => (
        <SidebarLink
          key={link.path}
          path={link.path}
          name={link.name}
          icon={link.icon}
          isActive={location.pathname === link.path}
          badge={link.badge}
        />
      ))}
    </nav>
  );
};