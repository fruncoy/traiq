import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardMetrics from "../components/DashboardMetrics";
import ActivityFeed from "../components/ActivityFeed";
import QuickActions from "../components/QuickActions";
import { Activity } from "@/types/activity";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const activities: Activity[] = [];

  const metrics = [
    { 
      label: "Total Tasks", 
      value: "3", 
      description: "Active tasks in the system" 
    },
    { 
      label: "Submissions", 
      value: "0", 
      description: "Pending review" 
    },
    { 
      label: "Tasks Submitted", 
      value: "0", 
      description: "Total tasks submitted" 
    },
    { 
      label: "Total Earnings", 
      value: "Ksh 0", 
      description: "Platform revenue" 
    }
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "tasks":
        navigate("/admin/submitted-tasks");
        break;
      case "bids":
        navigate("/admin/bidding");
        break;
      case "payments":
        navigate("/admin/finances");
        break;
      case "taskers":
        navigate("/admin/taskers");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin>
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <DashboardMetrics metrics={metrics} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-6">
            <ActivityFeed activities={activities} />
            <QuickActions onAction={handleQuickAction} />
          </div>
        </main>
      </Sidebar>
    </div>
  );
};

export default AdminDashboard;