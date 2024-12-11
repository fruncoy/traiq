import { LogOut, User, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface HeaderActionsProps {
  onLogout: () => void;
}

export const HeaderActions = ({ onLogout }: HeaderActionsProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      toast.loading("Refreshing data...");
      
      // Force refetch all queries with fresh data
      await queryClient.invalidateQueries({
        refetchType: 'active',
        type: 'all'
      });
      
      // Wait for all queries to settle
      await queryClient.resumePausedMutations();
      
      toast.success("Data refreshed successfully");
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error("Failed to refresh data. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handleRefresh}
        className="p-2 hover:bg-gray-100 rounded-full relative"
        aria-label="Refresh data"
        disabled={isRefreshing}
      >
        <RefreshCw 
          size={20} 
          className={`text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} 
        />
      </button>
      <button
        onClick={() => navigate("/tasker/settings")}
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