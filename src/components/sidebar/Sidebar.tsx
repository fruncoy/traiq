import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SidebarContent } from "./SidebarContent";
import { MobileHeader } from "./MobileHeader";
import { MainHeader } from "./MainHeader";
import { LoadingSpinner } from "../ui/loading-spinner";
import { toast } from "sonner";

interface SidebarProps {
  isAdmin?: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
}

export const Sidebar = ({ 
  isAdmin = false, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen 
}: SidebarProps) => {
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
    enabled: !!session?.user?.id
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
    enabled: isAdmin
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Successfully logged out");
    navigate("/");
  };

  if (notificationsLoading || submissionsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <MobileHeader 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isAdmin={isAdmin}
      />

      <div className={`fixed lg:relative w-64 h-screen bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out z-40 lg:translate-x-0 ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
          <span className="text-2xl font-bold text-primary-DEFAULT">TRAIQ</span>
        </div>
        <SidebarContent 
          isAdmin={isAdmin}
          notifications={notifications}
          pendingSubmissions={pendingSubmissions}
        />
      </div>

      <MainHeader 
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />
    </>
  );
};