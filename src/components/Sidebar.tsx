import React from "react";
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
  TicketIcon
} from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNav } from "./sidebar/SidebarNav";
import { LoadingSpinner } from "./ui/loading-spinner";
import { LinkItem } from "./sidebar/types";

interface SidebarProps {
  isAdmin?: boolean;
  children?: React.ReactNode;
}

const Sidebar = ({ isAdmin = false, children }: SidebarProps) => {
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

  if (notificationsLoading || ticketsLoading || submissionsLoading) {
    return <LoadingSpinner />;
  }

  const links: LinkItem[] = isAdmin ? [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Tasks", path: "/admin/tasks", icon: ClipboardList },
    { name: "Submitted Tasks", path: "/admin/submitted-tasks", icon: Upload, badge: pendingSubmissions.length },
    { name: "Finances", path: "/admin/finances", icon: DollarSign },
    { name: "Taskers", path: "/admin/taskers", icon: Users },
    { name: "Tickets", path: "/admin/tickets", icon: TicketIcon, badge: pendingTickets.length },
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

  return (
    <div className="flex h-screen bg-white">
      <div className="w-64 border-r border-gray-200 flex-shrink-0">
        <SidebarHeader />
        <SidebarNav links={links} />
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
