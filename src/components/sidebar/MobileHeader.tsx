import { Menu, User, LogOut, BellDot, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface MobileHeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
  isAdmin?: boolean;
}

export const MobileHeader = ({ isMobileMenuOpen, setIsMobileMenuOpen, isAdmin = false }: MobileHeaderProps) => {
  const navigate = useNavigate();
  const currentTasker = JSON.parse(localStorage.getItem('currentTasker') || '{}');

  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ['notifications', currentTasker.id],
    queryFn: async () => {
      if (isAdmin) {
        const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
        return tickets.filter((t: any) => t.status === 'pending');
      }
      const stored = localStorage.getItem(`notifications_${currentTasker.id}`);
      return stored ? JSON.parse(stored) : [];
    },
    refetchInterval: 1000
  });

  const hasUnreadNotifications = isAdmin 
    ? notifications.length > 0 
    : notifications.some((n: any) => !n.read);
  const unreadCount = isAdmin 
    ? notifications.length 
    : notifications.filter((n: any) => !n.read).length;

  const handleLogout = () => {
    toast.success("Successfully logged out");
    navigate("/");
  };

  const handleUserClick = () => {
    navigate("/tasker/settings");
  };

  const handleNotificationClick = () => {
    navigate(isAdmin ? "/admin/tickets" : "/tasker/notifications");
  };

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
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
          <button
            onClick={handleNotificationClick}
            className="p-2 hover:bg-gray-100 rounded-full relative"
            aria-label="Notifications"
          >
            {hasUnreadNotifications ? (
              <BellDot size={20} className="text-gray-600" />
            ) : (
              <Bell size={20} className="text-gray-600" />
            )}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={handleUserClick}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="User settings"
          >
            <User size={20} className="text-gray-600" />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Logout"
          >
            <LogOut size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};