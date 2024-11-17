import Sidebar from "../components/Sidebar";
import DashboardMetrics from "../components/DashboardMetrics";

const TaskerDashboard = () => {
  const metrics = [
    { label: "Available Bids", value: "8" },
    { label: "Active Tasks", value: "3" },
    { label: "Total Earned", value: "$890" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="lg:ml-64 p-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-8">Dashboard</h1>
        <DashboardMetrics metrics={metrics} />
      </div>
    </div>
  );
};

export default TaskerDashboard;