import Sidebar from "../components/Sidebar";
import DashboardMetrics from "../components/DashboardMetrics";
import TaskList from "../components/TaskList";
import BiddingSection from "../components/tasker/BiddingSection";
import BuyBidsSection from "../components/tasker/BuyBidsSection";
import TaskerSettings from "../components/tasker/TaskerSettings";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const TaskerDashboard = () => {
  const location = useLocation();
  const currentTasker = JSON.parse(localStorage.getItem('currentTasker') || '{}');

  const { data: userBids = 0 } = useQuery({
    queryKey: ['user-bids', currentTasker.id],
    queryFn: async () => {
      const taskers = JSON.parse(localStorage.getItem('taskers') || '[]');
      const tasker = taskers.find((t: any) => t.id === currentTasker.id);
      return tasker?.bids || 0;
    },
    refetchInterval: 1000
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const storedTasks = localStorage.getItem('tasks');
      return storedTasks ? JSON.parse(storedTasks) : [];
    },
    refetchInterval: 1000
  });

  const { data: userEarnings = 0 } = useQuery({
    queryKey: ['user-earnings', currentTasker.id],
    queryFn: async () => {
      const earnings = JSON.parse(localStorage.getItem('userEarnings') || '{}');
      return earnings[currentTasker.id] || 0;
    },
    refetchInterval: 1000
  });

  const { data: totalEarned = 0 } = useQuery({
    queryKey: ['total-earned', currentTasker.id],
    queryFn: async () => {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      return tasks.reduce((total: number, task: any) => {
        const approvedSubmission = task.submissions?.find(
          (s: any) => s.bidderId === currentTasker.id && s.status === 'approved'
        );
        if (approvedSubmission) {
          return total + (task.category === 'genai' ? 700 : 300);
        }
        return total;
      }, 0);
    },
    refetchInterval: 1000
  });

  const availableTasks = tasks.filter(t => !t.status || t.status === 'pending').length;

  const metrics = [
    { 
      label: "Available Bids", 
      value: userBids.toString(),
      description: "Use them wisely to secure tasks" 
    },
    { 
      label: "Available Tasks", 
      value: availableTasks,
      description: "Tasks waiting for bids" 
    },
    {
      label: "Available Balance",
      value: `KES ${userEarnings}`,
      description: "Current withdrawable balance"
    },
    {
      label: "Total Earned",
      value: `KES ${totalEarned}`,
      description: "Total earnings to date"
    }
  ];

  const renderContent = () => {
    switch (location.pathname) {
      case "/tasker":
        return (
          <>
            <DashboardMetrics metrics={metrics} />
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <TaskList />
            </div>
          </>
        );
      case "/tasker/tasks":
        return <TaskList />;
      case "/tasker/bidding":
        return <BiddingSection />;
      case "/tasker/buy-bids":
        return <BuyBidsSection />;
      case "/tasker/settings":
        return <TaskerSettings />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {location.pathname === "/tasker" ? "Dashboard" :
             location.pathname === "/tasker/tasks" ? "Tasks" :
             location.pathname === "/tasker/bidding" ? "Bidding" :
             location.pathname === "/tasker/buy-bids" ? "Buy Bids" : "Settings"}
          </h1>
          {renderContent()}
        </div>
      </Sidebar>
    </div>
  );
};

export default TaskerDashboard;