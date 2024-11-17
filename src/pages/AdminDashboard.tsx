import Sidebar from "../components/Sidebar";
import DashboardMetrics from "../components/DashboardMetrics";
import TaskList from "../components/TaskList";
import { useLocation } from "react-router-dom";

const AdminDashboard = () => {
  const location = useLocation();
  const metrics = [
    { label: "Total Tasks", value: "156", change: "+12% from last month" },
    { label: "Active Submissions", value: "43", change: "+5% from last month" },
    { label: "Total Earnings", value: "$12,543", change: "+18% from last month" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar isAdmin />
      <div className="p-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-8">
          {location.pathname === "/admin" ? "Dashboard" : 
           location.pathname === "/admin/tasks" ? "Tasks" :
           location.pathname === "/admin/bidding" ? "Bidding" :
           location.pathname === "/admin/finances" ? "Finances" :
           location.pathname === "/admin/taskers" ? "Taskers" : "Settings"}
        </h1>
        {location.pathname === "/admin" && <DashboardMetrics metrics={metrics} />}
        {location.pathname === "/admin/tasks" && <TaskList />}
      </div>
    </div>
  );
};

export default AdminDashboard;