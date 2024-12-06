import { useLocation } from "react-router-dom";
import { SidebarLink } from "./SidebarLink";
import { LinkItem } from "./types";
import { LayoutDashboard, ClipboardList, Timer, ShoppingCart, Settings } from "lucide-react";

interface SidebarNavProps {
  isAdmin?: boolean;
}

export const SidebarNav = ({ isAdmin = false }: SidebarNavProps) => {
  const location = useLocation();
  
  const adminLinks: LinkItem[] = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard
    },
    {
      name: "Tasks",
      path: "/admin/tasks",
      icon: ClipboardList
    },
    {
      name: "Submitted Tasks",
      path: "/admin/submitted-tasks",
      icon: Timer
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: Settings
    }
  ];

  const taskerLinks: LinkItem[] = [
    {
      name: "Dashboard",
      path: "/tasker",
      icon: LayoutDashboard
    },
    {
      name: "Tasks",
      path: "/tasker/tasks",
      icon: ClipboardList
    },
    {
      name: "Bidding",
      path: "/tasker/bidding",
      icon: Timer
    },
    {
      name: "Buy Bids",
      path: "/tasker/buy-bids",
      icon: ShoppingCart
    },
    {
      name: "Settings",
      path: "/tasker/settings",
      icon: Settings
    }
  ];

  const links = isAdmin ? adminLinks : taskerLinks;
  
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