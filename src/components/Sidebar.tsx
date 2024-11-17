import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LayoutDashboard, ClipboardList, Gavel, DollarSign, Users, Settings, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isAdmin?: boolean;
}

const Sidebar = ({ isAdmin = false }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
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
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-30 flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="ml-4 p-2 hover:bg-gray-100 rounded-md"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="ml-4 lg:ml-64 flex items-center">
          <span className="text-2xl font-bold text-primary-DEFAULT">TRAIQ</span>
        </div>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-lg transition-transform duration-300 z-40",
        "w-64",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4">
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
                      ? "bg-primary-DEFAULT text-white"
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

      {/* Main content padding */}
      <div className={cn(
        "pt-16 transition-all duration-300",
        isOpen ? "lg:ml-64" : "lg:ml-0"
      )}>
        <div className="p-4">
          {/* Your page content goes here */}
        </div>
      </div>
    </>
  );
};

export default Sidebar;