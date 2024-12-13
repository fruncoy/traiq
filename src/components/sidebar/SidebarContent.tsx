import React from "react";
import { 
  LayoutDashboard, 
  Clipboard, 
  Upload, 
  DollarSign,
  Users,
  Settings,
  CreditCard,
  Briefcase,
  Bell,
  BellDot
} from "lucide-react";
import { SidebarNav } from "./SidebarNav";
import { LinkItem } from "./types";

interface SidebarContentProps {
  isAdmin: boolean;
  notifications: any[];
  pendingSubmissions: any[];
}

export const SidebarContent = ({ 
  isAdmin, 
  notifications, 
  pendingSubmissions 
}: SidebarContentProps) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  const hasUnreadNotifications = unreadCount > 0;

  const links: LinkItem[] = isAdmin ? [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Tasks", path: "/admin/tasks", icon: Clipboard },
    { name: "Submitted Tasks", path: "/admin/submitted-tasks", icon: Upload, badge: pendingSubmissions?.length },
    { name: "Finances", path: "/admin/finances", icon: DollarSign },
    { name: "Taskers", path: "/admin/taskers", icon: Users },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ] : [
    { name: "Dashboard", path: "/tasker", icon: LayoutDashboard },
    { name: "Buy Bids", path: "/tasker/buy-bids", icon: CreditCard },
    { name: "Tasks", path: "/tasker/tasks", icon: Clipboard },
    { name: "Bidded Tasks", path: "/tasker/bidded-tasks", icon: Briefcase },
    { name: "Submit Task", path: "/tasker/submit-task", icon: Upload },
    { name: "Notifications", path: "/tasker/notifications", icon: hasUnreadNotifications ? BellDot : Bell, badge: unreadCount },
    { name: "Settings", path: "/tasker/settings", icon: Settings },
  ];

  return (
    <div className="mt-16 lg:mt-0">
      <SidebarNav links={links} />
    </div>
  );
};