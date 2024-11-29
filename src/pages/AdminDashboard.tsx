import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardMetrics from "../components/DashboardMetrics";
import ActivityFeed from "../components/ActivityFeed";
import QuickActions from "../components/QuickActions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Query to get total revenue from bid transactions
  const { data: totalRevenue = 0 } = useQuery({
    queryKey: ['admin-total-revenue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bid_transactions')
        .select('amount')
        .throwOnError();

      if (error) throw error;
      return data?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0;
    }
  });

  const metrics = [
    { 
      label: "Total Tasks", 
      value: "0", // This will be overridden by DashboardMetrics component
      description: "Total tasks in the system" 
    },
    { 
      label: "Today's Submissions", 
      value: "0", // This will be overridden by DashboardMetrics component
      description: "Task submissions for today" 
    },
    { 
      label: "Pending Reviews", 
      value: "0", // This will be overridden by DashboardMetrics component
      description: "Tasks awaiting review" 
    },
    { 
      label: "Total Revenue", 
      value: `KES ${totalRevenue}`, 
      description: "Platform revenue from bid purchases" 
    }
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "tasks":
        navigate("/admin/submitted-tasks");
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