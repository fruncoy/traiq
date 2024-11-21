import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NotificationBadge } from "../ui/notification-badge";

interface SidebarLinkProps {
  path: string;
  name: string;
  icon: React.ComponentType<any>;
  isActive: boolean;
  badge?: number;
}

export const SidebarLink = ({ path, name, icon: Icon, isActive, badge }: SidebarLinkProps) => {
  return (
    <Link
      to={path}
      className={cn(
        "flex items-center justify-between px-4 py-3 rounded-lg transition-colors",
        isActive 
          ? "bg-blue-50 text-[#1E40AF]" 
          : "text-gray-600 hover:bg-gray-50"
      )}
    >
      <div className="flex items-center space-x-3">
        <Icon size={20} />
        <span className="text-sm font-medium">{name}</span>
      </div>
      {badge !== undefined && <NotificationBadge count={badge} />}
    </Link>
  );
};