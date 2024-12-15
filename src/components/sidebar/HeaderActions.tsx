import { LogOut, RefreshCw, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface HeaderActionsProps {
  onLogout: () => void;
  isAdmin?: boolean;
}

export const HeaderActions = ({ onLogout, isAdmin }: HeaderActionsProps) => {
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    try {
      // Invalidate all queries to refresh data
      await queryClient.invalidateQueries();
      toast.success("Data refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh data");
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleRefresh}
        className="hover:bg-gray-100"
      >
        <RefreshCw className="h-5 w-5 text-gray-600" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-gray-100"
      >
        <User className="h-5 w-5 text-gray-600" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onLogout}
        className="hover:bg-gray-100"
      >
        <LogOut className="h-5 w-5 text-gray-600" />
      </Button>
    </div>
  );
};