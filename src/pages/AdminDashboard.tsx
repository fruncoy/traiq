import Sidebar from "../components/Sidebar";
import DashboardMetrics from "../components/DashboardMetrics";
import { useLocation } from "react-router-dom";

const AdminDashboard = () => {
  const location = useLocation();
  const metrics = [
    { label: "Total Tasks", value: "156", change: "+12% from last month" },
    { label: "Active Submissions", value: "43", change: "+5% from last month" },
    { label: "Total Earnings", value: "$12,543", change: "+18% from last month" },
  ];

  return (
    <div className="min-h-screen">
      <Sidebar isAdmin />
      {location.pathname === "/admin" && <DashboardMetrics metrics={metrics} />}
    </div>
  );
};

export default AdminDashboard;