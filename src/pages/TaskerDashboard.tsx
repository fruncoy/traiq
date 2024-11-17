import Sidebar from "../components/Sidebar";
import DashboardMetrics from "../components/DashboardMetrics";
import TaskList from "../components/TaskList";
import BiddingSection from "../components/tasker/BiddingSection";
import BuyBidsSection from "../components/tasker/BuyBidsSection";
import TaskerSettings from "../components/tasker/TaskerSettings";
import { useLocation } from "react-router-dom";

const TaskerDashboard = () => {
  const location = useLocation();
  const metrics = [
    { 
      label: "Available Bids", 
      value: "8",
      description: "Use them wisely to secure tasks" 
    },
    { 
      label: "Active Tasks", 
      value: "3",
      description: "Tasks in progress" 
    },
    { 
      label: "Total Earned", 
      value: "Ksh 89,000",
      change: "+12% from last month" 
    },
    { 
      label: "Success Rate", 
      value: "92%",
      description: "Based on last 50 tasks" 
    }
  ];

  const renderContent = () => {
    switch (location.pathname) {
      case "/tasker":
        return (
          <>
            <DashboardMetrics metrics={metrics} />
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <TaskList />
            </div>
          </>
        );
      case "/tasker/tasks":
        return <TaskList />;
      case "/tasker/bidding":
        return <BiddingSection />;
      case "/tasker/buy-bids":
        return <BuyBidsSection />;
      case "/tasker/settings":
        return <TaskerSettings />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {location.pathname === "/tasker" ? "Dashboard" :
             location.pathname === "/tasker/tasks" ? "Tasks" :
             location.pathname === "/tasker/bidding" ? "Bidding" :
             location.pathname === "/tasker/buy-bids" ? "Buy Bids" : "Settings"}
          </h1>
          {renderContent()}
        </div>
      </Sidebar>
    </div>
  );
};

export default TaskerDashboard;