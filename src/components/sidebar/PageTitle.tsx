import { useLocation } from "react-router-dom";

export const PageTitle = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/admin": return "Dashboard";
      case "/admin/tasks": return "Tasks";
      case "/admin/submitted-tasks": return "Submitted Tasks";
      case "/admin/finances": return "Finances";
      case "/admin/taskers": return "Taskers";
      case "/admin/tickets": return "Tickets";
      case "/admin/settings": return "Settings";
      case "/tasker": return "Dashboard";
      case "/tasker/buy-bids": return "Buy Bids";
      case "/tasker/tasks": return "Tasks";
      case "/tasker/bidded-tasks": return "Bidded Tasks";
      case "/tasker/submit-task": return "Submit Task";
      case "/tasker/notifications": return "Notifications";
      case "/tasker/settings": return "Settings";
      default: return "";
    }
  };

  return (
    <h1 className="text-xl font-semibold text-gray-800 mb-6">
      {getPageTitle()}
    </h1>
  );
};