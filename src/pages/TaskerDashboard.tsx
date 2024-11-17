import Sidebar from "../components/Sidebar";
import DashboardMetrics from "../components/DashboardMetrics";
import TaskList from "../components/TaskList";
import { useLocation } from "react-router-dom";

const TaskerDashboard = () => {
  const location = useLocation();
  const metrics = [
    { label: "Available Bids", value: "8" },
    { label: "Active Tasks", value: "3" },
    { label: "Total Earned", value: "$890" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="p-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-8">
          {location.pathname === "/tasker" ? "Dashboard" :
           location.pathname === "/tasker/tasks" ? "Tasks" :
           location.pathname === "/tasker/bidding" ? "Bidding" :
           location.pathname === "/tasker/buy-bids" ? "Buy Bids" : "Settings"}
        </h1>
        {location.pathname === "/tasker" && <DashboardMetrics metrics={metrics} />}
        {location.pathname === "/tasker/tasks" && <TaskList />}
      </div>
    </div>
  );
};

export default TaskerDashboard;