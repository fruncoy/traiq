import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardMetrics from "../components/DashboardMetrics";
import ActivityFeed from "../components/ActivityFeed";
import QuickActions from "../components/QuickActions";
import { Activity } from "@/types/activity";
import { useQuery } from "@tanstack/react-query";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { data: totalRevenue = 0 } = useQuery({
    queryKey: ['total-revenue'],
    queryFn: async () => {
      return parseFloat(localStorage.getItem('totalSpent') || '0');
    }
  });

  const { data: activeTasks = [] } = useQuery({
    queryKey: ['active-tasks'],
    queryFn: async () => {
      const tasks = localStorage.getItem('activeTasks');
      return tasks ? JSON.parse(tasks) : [];
    }
  });

  const { data: allTasks = [] } = useQuery({
    queryKey: ['all-tasks'],
    queryFn: async () => {
      const tasks = localStorage.getItem('tasks');
      return tasks ? JSON.parse(tasks) : [];
    }
  });

  const metrics = [
    { 
      label: "Total Tasks", 
      value: allTasks.length.toString(), 
      description: "Active tasks in the system" 
    },
    { 
      label: "Active Tasks", 
      value: activeTasks.length.toString(), 
      description: "Tasks being worked on" 
    },
    { 
      label: "Total Earnings", 
      value: `KES ${totalRevenue}`, 
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
            <ActivityFeed />
            <QuickActions onAction={handleQuickAction} />
          </div>
        </main>
      </Sidebar>
    </div>
  );
};

export default AdminDashboard;