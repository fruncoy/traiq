import { LogOut, User, RefreshCw, Bell, BellDot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface HeaderActionsProps {
  unreadCount: number;
  isAdmin: boolean;
  onLogout: () => void;
}

export const HeaderActions = ({ unreadCount, isAdmin, onLogout }: HeaderActionsProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleUserClick = () => {
    navigate("/tasker/settings");
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries();
    toast.success("Data refreshed successfully");
  };

  return (
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
        onClick={onLogout}
        className="p-2 hover:bg-gray-100 rounded-full"
        aria-label="Logout"
      >
        <LogOut size={20} className="text-gray-600" />
      </button>
    </div>
  );
};