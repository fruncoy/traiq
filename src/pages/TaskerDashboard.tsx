import Sidebar from "../components/Sidebar";
import DashboardMetrics from "../components/DashboardMetrics";
import TaskList from "../components/TaskList";
import BiddingSection from "../components/tasker/BiddingSection";
import BuyBidsSection from "../components/tasker/BuyBidsSection";
import TaskerSettings from "../components/tasker/TaskerSettings";
import { useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

const TaskerDashboard = () => {
  const location = useLocation();
  const userId = 'current-user-id'; // In a real app, this would come from auth

  const { data: userBids = 0 } = useQuery({
    queryKey: ['user-bids'],
    queryFn: async () => {
      return parseInt(localStorage.getItem('userBids') || '0');
    }
  });

  const { data: userEarnings = { totalEarned: 0, pendingTasks: 0, completedTasks: 0, balance: 0 } } = useQuery({
    queryKey: ['user-earnings'],
    queryFn: async () => {
      const earnings = JSON.parse(localStorage.getItem('userEarnings') || '{}');
      return earnings[userId] || { totalEarned: 0, pendingTasks: 0, completedTasks: 0, balance: 0 };
    }
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ['task-submissions'],
    queryFn: async () => {
      const subs = localStorage.getItem('taskSubmissions');
      return subs ? JSON.parse(subs) : [];
    }
  });

  const calculateSuccessRate = () => {
    if (submissions.length === 0) return "0%";
    const approved = submissions.filter((sub: any) => sub.status === 'approved').length;
    return `${Math.round((approved / submissions.length) * 100)}%`;
  };

  const metrics = [
    { 
      label: "Available Bids", 
      value: userBids.toString(),
      description: "Use them wisely to secure tasks" 
    },
    { 
      label: "Account Balance", 
      value: `KES ${userEarnings.balance}`,
      description: "Available for withdrawal" 
    },
    { 
      label: "Total Earned", 
      value: `KES ${userEarnings.totalEarned}`,
      description: "All time earnings"
    },
    { 
      label: "Success Rate", 
      value: calculateSuccessRate(),
      description: "Based on approved submissions" 
    }
  ];

  const renderContent = () => {
    switch (location.pathname) {
      case "/tasker":
        return (
          <>
            <DashboardMetrics metrics={metrics} />
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Account Balance</h3>
                <p className="text-2xl font-bold text-[#1E40AF]">KES {userEarnings.balance}</p>
              </CardContent>
            </Card>
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