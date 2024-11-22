import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Bell, 
  Settings,
  DollarSign,
  Users,
  Upload,
  CreditCard,
  Briefcase,
  TicketIcon,
  Menu
} from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { SidebarNav } from "./sidebar/SidebarNav";
import { LoadingSpinner } from "./ui/loading-spinner";
import { LinkItem } from "./sidebar/types";
import { cn } from "@/lib/utils";
import { getCurrentTasker, logoutTasker } from "@/utils/auth";

interface SidebarProps {
  isAdmin?: boolean;
  children: React.ReactNode;
}

const Sidebar = ({ isAdmin = false, children }: SidebarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentTasker = getCurrentTasker();

  const { isLoading, data: tasks } = useQuery(["tasks"], fetchTasks);

  const handleLogout = () => {
    logoutTasker();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        <SidebarNav>
          <LinkItem icon={LayoutDashboard} label="Dashboard" href="/tasker" />
          <LinkItem icon={ClipboardList} label="Tasks" href="/tasker/tasks" />
          <LinkItem icon={Bell} label="Notifications" href="/tasker/notifications" />
          <LinkItem icon={Settings} label="Settings" href="/tasker/settings" />
          <LinkItem icon={DollarSign} label="Payments" href="/tasker/payments" />
          <LinkItem icon={Users} label="Team" href="/tasker/team" />
          <LinkItem icon={Upload} label="Upload" href="/tasker/upload" />
          <LinkItem icon={CreditCard} label="Buy Bids" href="/tasker/buy-bids" />
          <LinkItem icon={Briefcase} label="My Tasks" href="/tasker/my-tasks" />
          <LinkItem icon={TicketIcon} label="Tickets" href="/tasker/tickets" />
          <LinkItem icon={Menu} label="More" href="/tasker/more" />
        </SidebarNav>
      </div>
      <button className="mt-4" onClick={handleLogout}>Logout</button>
      {isLoading && <LoadingSpinner />}
      {children}
    </div>
  );
};

export default Sidebar;
