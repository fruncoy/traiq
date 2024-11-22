import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
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
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-2xl font-bold text-[#1E40AF]">TRAIQ</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  location.pathname === link.path 
                    ? "bg-blue-50 text-[#1E40AF]" 
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <link.icon size={20} />
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-4 text-gray-600"
        >
          <Menu size={24} />
        </button>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-white">
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
              <span className="text-2xl font-bold text-[#1E40AF]">TRAIQ</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-600"
              >
                <Menu size={24} />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    location.pathname === link.path 
                      ? "bg-blue-50 text-[#1E40AF]" 
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <link.icon size={20} />
                  <span>{link.name}</span>
                </Link>
              ))}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-4"
              >
                Logout
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && <LoadingSpinner />}
        {children}
      </div>
    </div>
  );
};

export default Sidebar;