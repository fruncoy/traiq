import Sidebar from "../components/Sidebar";
import DashboardMetrics from "../components/DashboardMetrics";

const AdminDashboard = () => {
  const metrics = [
    { label: "Total Tasks", value: "156", change: "+12% from last month" },
    { label: "Active Submissions", value: "43", change: "+5% from last month" },
    { label: "Total Earnings", value: "$12,543", change: "+18% from last month" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar isAdmin />
      <div className="lg:ml-64 p-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-8">Dashboard</h1>
        <DashboardMetrics metrics={metrics} />
      </div>
    </div>
  );
};

export default AdminDashboard;