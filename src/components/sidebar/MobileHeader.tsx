import { Menu, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface MobileHeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
}

export const MobileHeader = ({ isMobileMenuOpen, setIsMobileMenuOpen }: MobileHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Successfully logged out");
    navigate("/");
  };

  const handleUserClick = () => {
    navigate("/tasker/settings");
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