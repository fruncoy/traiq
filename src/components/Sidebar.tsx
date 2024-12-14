import { supabase } from "@/integrations/supabase/client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
  BellDot,
  Terminal
} from "lucide-react";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNav } from "./sidebar/SidebarNav";
import { MobileHeader } from "./sidebar/MobileHeader";
import { PageTitle } from "./sidebar/PageTitle";
import { LoadingSpinner } from "./ui/loading-spinner";
import { LinkItem } from "./sidebar/types";
import { cn } from "@/lib/utils";
import { HeaderActions } from "./sidebar/HeaderActions";
import { toast } from "sonner";

interface SidebarProps {
  isAdmin?: boolean;
  children?: React.ReactNode;
}

const Sidebar = ({ isAdmin = false, children }: SidebarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ['notifications', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id,
    refetchOnWindowFocus: false,
    refetchInterval: false
  });

  const { data: pendingSubmissions = [], isLoading: submissionsLoading } = useQuery({
    queryKey: ['pending-submissions'],
    queryFn: async () => {
      if (!isAdmin) return [];
      const { data, error } = await supabase
        .from('task_submissions')
        .select('*')
        .eq('status', 'pending');
      
      if (error) throw error;
      return data || [];
    },
    enabled: isAdmin,
    refetchOnWindowFocus: false,
    refetchInterval: false
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Successfully logged out");
    navigate("/");
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const hasUnreadNotifications = unreadCount > 0;

  const links: LinkItem[] = isAdmin ? [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Tasks", path: "/admin/tasks", icon: Clipboard },
    { name: "Submitted Tasks", path: "/admin/submitted-tasks", icon: Upload, badge: pendingSubmissions?.length },
    { name: "Finances", path: "/admin/finances", icon: DollarSign },
    { name: "Taskers", path: "/admin/taskers", icon: Users },
    { name: "Console Logs", path: "/admin/console-logs", icon: Terminal },
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

  if (notificationsLoading || submissionsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-screen bg-white">
      <MobileHeader 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isAdmin={isAdmin}
      />

      <div className={cn(
        "fixed lg:relative w-64 h-screen bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out z-40",
        "lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
          <span className="text-2xl font-bold text-primary-DEFAULT">TRAIQ</span>
        </div>
        <div className="mt-16 lg:mt-0">
          <SidebarNav links={links} />
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
          <PageTitle />
          <HeaderActions onLogout={handleLogout} isAdmin={isAdmin} />
        </header>

        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>

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