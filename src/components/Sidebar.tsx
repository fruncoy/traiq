import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  ClipboardList, 
  DollarSign, 
  Users, 
  Settings, 
  LogOut, 
  BellDot,
  Bell, 
  Upload, 
  CreditCard,
  Briefcase,
  TicketIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface SidebarProps {
  isAdmin?: boolean;
  children?: React.ReactNode;
}

const Sidebar = ({ isAdmin = false, children }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Query to check for unread notifications
  const { data: hasUnreadNotifications = false } = useQuery({
    queryKey: ['unread-notifications'],
    queryFn: async () => {
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      return notifications.some((n: any) => !n.read);
    },
    refetchInterval: 5000
  });

  const adminLinks = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Tasks", path: "/admin/tasks", icon: ClipboardList },
    { name: "Submitted Tasks", path: "/admin/submitted-tasks", icon: Upload },
    { name: "Finances", path: "/admin/finances", icon: DollarSign },
    { name: "Taskers", path: "/admin/taskers", icon: Users },
    { name: "Tickets", path: "/admin/tickets", icon: TicketIcon },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  const taskerLinks = [
    { name: "Dashboard", path: "/tasker", icon: LayoutDashboard },
    { name: "Buy Bids", path: "/tasker/buy-bids", icon: CreditCard },
    { name: "Tasks", path: "/tasker/tasks", icon: ClipboardList },
    { name: "Bidded Tasks", path: "/tasker/bidded-tasks", icon: Briefcase },
    { name: "Submit Task", path: "/tasker/submit-task", icon: Upload },
    { 
      name: "Notifications", 
      path: "/tasker/notifications", 
      icon: hasUnreadNotifications ? BellDot : Bell 
    },
    { name: "Settings", path: "/tasker/settings", icon: Settings },
  ];

  const links = isAdmin ? adminLinks : taskerLinks;

  const handleLogout = () => {
    toast.success("Successfully logged out");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="w-64 border-r border-gray-200 flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-2xl font-bold text-[#1E40AF]">TRAIQ</span>
        </div>
        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                  isActive 
                    ? "bg-blue-50 text-[#1E40AF]" 
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-gray-800">
            {location.pathname === "/admin" ? "Dashboard" : 
             location.pathname === "/admin/tasks" ? "Tasks" :
             location.pathname === "/admin/submitted-tasks" ? "Submitted Tasks" :
             location.pathname === "/admin/finances" ? "Finances" :
             location.pathname === "/admin/taskers" ? "Taskers" : 
             location.pathname === "/admin/tickets" ? "Tickets" :
             location.pathname === "/admin/settings" ? "Settings" :
             location.pathname === "/tasker" ? "Dashboard" :
             location.pathname === "/tasker/buy-bids" ? "Buy Bids" :
             location.pathname === "/tasker/tasks" ? "Tasks" :
             location.pathname === "/tasker/bidded-tasks" ? "Bidded Tasks" :
             location.pathname === "/tasker/submit-task" ? "Submit Task" :
             location.pathname === "/tasker/notifications" ? "Notifications" : "Settings"}
          </h1>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Logout"
          >
            <LogOut size={20} className="text-gray-600" />
          </button>
        </header>

        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;