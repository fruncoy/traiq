import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardMetrics from "../components/DashboardMetrics";
import ActivityFeed from "../components/ActivityFeed";
import QuickActions from "../components/QuickActions";
import { useQuery } from "@tanstack/react-query";
import { startOfDay, endOfDay } from "date-fns";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const today = new Date();
  const startOfToday = startOfDay(today);
  const endOfToday = endOfDay(today);

  const { data: totalRevenue = 0 } = useQuery({
    queryKey: ['total-revenue'],
    queryFn: async () => {
      return parseFloat(localStorage.getItem('totalSpent') || '0');
    }
  });

  const { data: allTasks = [] } = useQuery({
    queryKey: ['all-tasks'],
    queryFn: async () => {
      const tasks = localStorage.getItem('tasks');
      return tasks ? JSON.parse(tasks) : [];
    }
  });

  const { data: todaySubmissions = [] } = useQuery({
    queryKey: ['today-submissions'],
    queryFn: async () => {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      return tasks.filter((task: any) => {
        const submissions = task.submissions || [];
        return submissions.some((sub: any) => {
          const subDate = new Date(sub.submittedAt);
          return subDate >= startOfToday && subDate <= endOfToday;
        });
      });
    }
  });

  const { data: pendingSubmissions = [] } = useQuery({
    queryKey: ['pending-submissions'],
    queryFn: async () => {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      return tasks.filter((task: any) => {
        const submissions = task.submissions || [];
        return submissions.some((sub: any) => sub.status === 'pending');
      });
    }
  });

  const metrics = [
    { 
      label: "Total Tasks", 
      value: allTasks.length.toString(), 
      description: "Total tasks in the system" 
    },
    { 
      label: "Today's Submissions", 
      value: todaySubmissions.length.toString(), 
      description: "Task submissions for today" 
    },
    { 
      label: "Pending Reviews", 
      value: pendingSubmissions.length.toString(), 
      description: "Tasks awaiting review" 
    },
    { 
      label: "Total Revenue", 
      value: `KES ${totalRevenue}`, 
      description: "Platform revenue" 
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