import { LogOut, User, RefreshCw, Bell, BellDot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface HeaderProps {
  unreadCount: number;
  isAdmin: boolean;
}

export const SidebarHeader = ({ unreadCount, isAdmin }: HeaderProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    toast.success("Successfully logged out");
    navigate("/");
  };

  const handleUserClick = () => {
    navigate("/tasker/settings");
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries();
    toast.success("Data refreshed successfully");
  };

  return (
    <header className="h-16 border-b border-gray-200 hidden lg:flex items-center justify-between px-6">
      <span className="text-2xl font-bold text-[#1E40AF]">TRAIQ</span>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleRefresh}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="Refresh data"
        >
          <RefreshCw size={20} className="text-gray-600" />
        </button>
        {!isAdmin && (
          <button
            onClick={() => navigate("/tasker/notifications")}
            className="p-2 hover:bg-gray-100 rounded-full relative"
            aria-label="Notifications"
          >
            {unreadCount > 0 ? (
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
        )}
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
    </header>
  );
};