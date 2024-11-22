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
      {/* Desktop/Tablet Sidebar - Fixed */}
      <div className="hidden md:block w-64 fixed h-full bg-white border-r border-gray-200">
        <div className="h-16 flex items-center px-6">
          <span className="text-2xl font-bold text-[#1E40AF]">TRAIQ</span>
        </div>
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
        <button 
          className="absolute bottom-4 left-4 right-4 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Mobile Header - As per drawing */}
      <div className="md:hidden flex items-center justify-between px-4 h-16 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Menu 
            size={24} 
            className="text-gray-600 cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
          <span className="text-2xl font-bold text-[#1E40AF]">TRAIQ</span>
        </div>
        <div className="flex items-center gap-2">
          <Bell size={24} className="text-gray-600" />
          <Settings size={24} className="text-gray-600" />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white">
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
            <span className="text-2xl font-bold text-[#1E40AF]">TRAIQ</span>
            <Menu 
              size={24} 
              className="text-gray-600 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
          <div className="p-4">
            {sidebarLinks.map((link) => (
              <div 
                key={link.path} 
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-gray-50"
                onClick={() => {
                  navigate(link.path);
                  setIsMobileMenuOpen(false);
                }}
              >
                <link.icon size={20} />
                <span>{link.name}</span>
              </div>
            ))}
            <button 
              className="w-full mt-4 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="md:ml-64 flex-1 p-4">
        {isLoading && <LoadingSpinner />}
        {children}
      </div>
    </div>
  );
};

export default Sidebar;