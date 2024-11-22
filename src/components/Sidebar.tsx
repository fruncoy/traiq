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
import { cn } from "@/lib/utils";
import { getCurrentTasker, logoutTasker } from "@/utils/auth";

interface SidebarProps {
  isAdmin?: boolean;
  children: React.ReactNode;
}

const fetchTasks = async () => {
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : [];
};

const Sidebar = ({ isAdmin = false, children }: SidebarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentTasker = getCurrentTasker();

  const { isLoading, data: tasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks
  });

  const handleLogout = () => {
    logoutTasker();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const sidebarLinks = [
    { icon: LayoutDashboard, name: "Dashboard", path: "/tasker" },
    { icon: ClipboardList, name: "Tasks", path: "/tasker/tasks" },
    { icon: Bell, name: "Notifications", path: "/tasker/notifications" },
    { icon: Settings, name: "Settings", path: "/tasker/settings" },
    { icon: DollarSign, name: "Payments", path: "/tasker/payments" },
    { icon: Users, name: "Team", path: "/tasker/team" },
    { icon: Upload, name: "Upload", path: "/tasker/upload" },
    { icon: CreditCard, name: "Buy Bids", path: "/tasker/buy-bids" },
    { icon: Briefcase, name: "My Tasks", path: "/tasker/my-tasks" },
    { icon: TicketIcon, name: "Tickets", path: "/tasker/tickets" },
    { icon: Menu, name: "More", path: "/tasker/more" }
  ];

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        <SidebarNav>
          {sidebarLinks.map((link) => (
            <div key={link.path} className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
              location.pathname === link.path ? "bg-gray-100" : "hover:bg-gray-50"
            )}>
              <link.icon size={20} />
              <span>{link.name}</span>
            </div>
          ))}
        </SidebarNav>
      </div>
      <button 
        className="mt-4 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
        onClick={handleLogout}
      >
        Logout
      </button>
      {isLoading && <LoadingSpinner />}
      {children}
    </div>
  );
};

export default Sidebar;