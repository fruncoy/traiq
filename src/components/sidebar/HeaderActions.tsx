import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeaderActionsProps {
  onLogout: () => void;
  isAdmin?: boolean;
}

export const HeaderActions = ({ onLogout, isAdmin = false }: HeaderActionsProps) => {
  const navigate = useNavigate();

  const handleUserClick = () => {
    const route = isAdmin ? "/admin/settings" : "/tasker/settings";
    navigate(route);
  };

  return (
    <div className="flex items-center space-x-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleUserClick}
        className="hover:bg-gray-100 rounded-full"
        aria-label="User settings"
      >
        <User size={20} className="text-gray-600" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onLogout}
        className="hover:bg-gray-100 rounded-full"
        aria-label="Logout"
      >
        <LogOut size={20} className="text-gray-600" />
      </Button>
    </div>
  );
};