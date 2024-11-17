import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ClipboardList, Gavel, DollarSign, Users, Settings, LogOut, Bell, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isAdmin?: boolean;
  children?: React.ReactNode;
}

const Sidebar = ({ isAdmin = false, children }: SidebarProps) => {
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
    { name: "Submit Task", path: "/tasker/submit-task", icon: Upload },
    { name: "Bidding", path: "/tasker/bidding", icon: Gavel },
    { name: "Notifications", path: "/tasker/notifications", icon: Bell },
    { name: "Settings", path: "/tasker/settings", icon: Settings },
  ];

  const links = isAdmin ? adminLinks : taskerLinks;

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
  };

  const getHeaderTitle = (pathname: string) => {
    if (isAdmin) {
      return pathname === "/admin" ? "Dashboard" : 
             pathname === "/admin/tasks" ? "Tasks" :
             pathname === "/admin/bidding" ? "Bidding" :
             pathname === "/admin/finances" ? "Finances" :
             pathname === "/admin/taskers" ? "Taskers" : "Settings";
    } else {
      return pathname === "/tasker" ? "Dashboard" : 
             pathname === "/tasker/tasks" ? "Tasks" :
             pathname === "/tasker/submit-task" ? "Submit Task" :
             pathname === "/tasker/bidding" ? "Bidding" :
             pathname === "/tasker/notifications" ? "Notifications" : "Settings";
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-2xl font-bold text-[#1E40AF]">TRAIQ</span>
        </div>
        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                  isActive 
                    ? "bg-blue-50 text-[#1E40AF]" 
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-gray-800">
            {getHeaderTitle(location.pathname)}
          </h1>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Logout"
          >
            <LogOut size={20} className="text-gray-600" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;