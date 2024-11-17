import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LayoutDashboard, ClipboardList, Gavel, DollarSign, Users, Settings, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isAdmin?: boolean;
}

const Sidebar = ({ isAdmin = false }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const adminLinks = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Tasks", path: "/admin/tasks", icon: ClipboardList },
    { name: "Bidding", path: "/admin/bidding", icon: Gavel },
    { name: "Finances", path: "/admin/finances", icon: DollarSign },
    { name: "Taskers", path: "/admin/taskers", icon: Users },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  const taskerLinks = [
    { name: "Dashboard", path: "/tasker", icon: LayoutDashboard },
    { name: "Tasks", path: "/tasker/tasks", icon: ClipboardList },
    { name: "Bidding", path: "/tasker/bidding", icon: Gavel },
    { name: "Buy Bids", path: "/tasker/buy-bids", icon: ShoppingCart },
    { name: "Settings", path: "/tasker/settings", icon: Settings },
  ];

  const links = isAdmin ? adminLinks : taskerLinks;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={cn(
        "fixed top-0 left-0 h-full bg-white shadow-lg transition-transform duration-300 z-40",
        "w-64 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-4">
          <Link to="/" className="flex items-center space-x-2 mb-8">
            <span className="text-2xl font-bold text-[#4169E1]">TRAIQ</span>
          </Link>
          <nav className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-md transition-colors",
                    location.pathname === link.path
                      ? "bg-[#4169E1] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <Icon size={20} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;