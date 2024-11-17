import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Sidebar from "../components/Sidebar";
import DashboardMetrics from "../components/DashboardMetrics";
import ActivityFeed from "../components/ActivityFeed";
import QuickActions from "../components/QuickActions";
import { Activity } from "@/types/activity";

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const activities: Activity[] = [
    {
      id: "1",
      type: "submission",
      message: "New task submission from John Doe",
      timestamp: "2 minutes ago"
    },
    {
      id: "2",
      type: "approval",
      message: "Task #123 approved",
      timestamp: "5 minutes ago"
    },
    {
      id: "3",
      type: "rejection",
      message: "Bid rejected for Task #456",
      timestamp: "10 minutes ago"
    },
    {
      id: "4",
      type: "pending",
      message: "New tasker registration pending approval",
      timestamp: "15 minutes ago"
    }
  ];

  const metrics = [
    { 
      label: "Total Tasks", 
      value: "156", 
      change: "+12% from last month",
      description: "Active tasks in the system" 
    },
    { 
      label: "Submissions", 
      value: "43", 
      change: "+5% from last month",
      description: "Pending review" 
    },
    { 
      label: "Approval Rate", 
      value: "89%", 
      change: "+2% from last month",
      description: "Task approval rate" 
    },
    { 
      label: "Total Earnings", 
      value: "Ksh 12,543", 
      change: "+18% from last month",
      description: "Platform revenue" 
    }
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "tasks":
        navigate("/admin/tasks");
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

  useEffect(() => {
    const timer = setTimeout(() => {
      toast({
        title: "New Submission",
        description: "A new task submission requires your review",
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

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