import { LogOut, User, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface HeaderActionsProps {
  onLogout: () => void;
}

export const HeaderActions = ({ onLogout }: HeaderActionsProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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