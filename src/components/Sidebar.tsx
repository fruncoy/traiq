import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LayoutDashboard, ClipboardList, Gavel, DollarSign, Users, Settings, ShoppingCart, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isAdmin?: boolean;
}

const Sidebar = ({ isAdmin = false }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
  };

  return (
    <>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30 flex items-center justify-between px-4">
        <div className="flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="text-2xl font-bold text-[#1E40AF] ml-4">TRAIQ</span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="Logout"
        >
          <LogOut size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-transform duration-300 z-40",
        "w-64",
        "lg:translate-x-0",
        !isOpen && "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6">
          <nav className="space-y-2">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                    "hover:bg-blue-50",
                    isActive 
                      ? "bg-blue-50 text-[#1E40AF] font-medium" 
                      : "text-gray-600"
                  )}
                >
                  <Icon size={20} />
                  <span className="text-sm">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content padding */}
      <div className={cn(
        "pt-16 transition-all duration-300",
        "lg:ml-64"
      )}>
        <div className="p-6">
          {/* Your page content goes here */}
        </div>
      </div>
    </>
  );
};

export default Sidebar;