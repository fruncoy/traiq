import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  TicketIcon,
  Menu,
  User
} from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNav } from "./sidebar/SidebarNav";
import { LoadingSpinner } from "./ui/loading-spinner";
import { LinkItem } from "./sidebar/types";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isAdmin?: boolean;
  children?: React.ReactNode;
}

const Sidebar = ({ isAdmin = false, children }: SidebarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentTasker = JSON.parse(localStorage.getItem('currentTasker') || '{}');

  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ['notifications', currentTasker.id],
    queryFn: async () => {
      const stored = localStorage.getItem(`notifications_${currentTasker.id}`);
      return stored ? JSON.parse(stored) : [];
    },
    refetchInterval: 1000
  });

  const { data: pendingTickets = [], isLoading: ticketsLoading } = useQuery({
    queryKey: ['pending-tickets'],
    queryFn: async () => {
      if (!isAdmin) return [];
      const stored = localStorage.getItem('tickets');
      const tickets = stored ? JSON.parse(stored) : [];
      return tickets.filter((t: any) => t.status === 'pending');
    },
    enabled: isAdmin,
    refetchInterval: isAdmin ? 1000 : false
  });

  const { data: pendingSubmissions = [], isLoading: submissionsLoading } = useQuery({
    queryKey: ['pending-submissions'],
    queryFn: async () => {
      if (!isAdmin) return [];
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      return tasks.filter((t: any) => 
        t.submissions?.some((s: any) => s.status === 'pending')
      );
    },
    enabled: isAdmin,
    refetchInterval: isAdmin ? 1000 : false
  });

  // Mark notifications as read when visiting notifications page
  React.useEffect(() => {
    if (location.pathname === '/tasker/notifications' && currentTasker.id) {
      const storedNotifications = JSON.parse(localStorage.getItem(`notifications_${currentTasker.id}`) || '[]');
      const updatedNotifications = storedNotifications.map((n: any) => ({
        ...n,
        read: true
      }));
      localStorage.setItem(`notifications_${currentTasker.id}`, JSON.stringify(updatedNotifications));
    }
  }, [location.pathname, currentTasker.id]);

  const hasUnreadNotifications = notifications.some((n: any) => !n.read);
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  const handleLogout = () => {
    toast.success("Successfully logged out");
    navigate("/");
  };

  const links: LinkItem[] = isAdmin ? [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Tasks", path: "/admin/tasks", icon: ClipboardList },
    { name: "Submitted Tasks", path: "/admin/submitted-tasks", icon: Upload, badge: pendingSubmissions?.length },
    { name: "Finances", path: "/admin/finances", icon: DollarSign },
    { name: "Taskers", path: "/admin/taskers", icon: Users },
    { name: "Tickets", path: "/admin/tickets", icon: TicketIcon, badge: pendingTickets?.length },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ] : [
    { name: "Dashboard", path: "/tasker", icon: LayoutDashboard },
    { name: "Buy Bids", path: "/tasker/buy-bids", icon: CreditCard },
    { name: "Tasks", path: "/tasker/tasks", icon: ClipboardList },
    { name: "Bidded Tasks", path: "/tasker/bidded-tasks", icon: Briefcase },
    { name: "Submit Task", path: "/tasker/submit-task", icon: Upload },
    { name: "Notifications", path: "/tasker/notifications", icon: hasUnreadNotifications ? BellDot : Bell, badge: unreadCount },
    { name: "Settings", path: "/tasker/settings", icon: Settings },
  ];

  if (notificationsLoading || ticketsLoading || submissionsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile Header - Updated to match design */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex flex-col">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg mr-2"
                aria-label="Toggle menu"
              >
                <Menu size={24} />
              </button>
              <span className="text-2xl font-bold text-primary-DEFAULT">TRAIQ</span>
            </div>
            <div className="flex items-center space-x-4">
              <User size={20} className="text-gray-600" />
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Logout"
              >
                <LogOut size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
          <div className="px-4 py-2 border-b border-gray-200">
            <h1 className="text-lg font-semibold text-gray-800">
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
          </div>
        </div>
      </div>

      {/* Desktop/Tablet Sidebar - Keeping existing implementation */}
      <div className={cn(
        "fixed lg:relative w-64 h-screen bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out z-40",
        "lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="hidden lg:block">
          <SidebarHeader />
        </div>
        <div className="mt-16 lg:mt-0">
          <SidebarNav links={links} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-gray-200 hidden lg:flex items-center justify-between px-6">
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

        <main className="flex-1 overflow-auto p-6 bg-gray-50 mt-32 lg:mt-0">
          {children}
        </main>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;
