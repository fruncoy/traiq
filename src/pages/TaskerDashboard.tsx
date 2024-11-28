import Sidebar from "../components/Sidebar";
import DashboardMetrics from "../components/DashboardMetrics";
import TaskList from "../components/TaskList";
import BiddingSection from "../components/tasker/BiddingSection";
import BuyBidsSection from "../components/tasker/BuyBidsSection";
import TaskerSettings from "../components/tasker/TaskerSettings";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const TaskerDashboard = () => {
  const location = useLocation();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  const { data: availableTasks = 0 } = useQuery({
    queryKey: ['available-tasks'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (error) throw error;
      return count || 0;
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { data: totalEarned = 0 } = useQuery({
    queryKey: ['total-earned', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return 0;
      
      const { data, error } = await supabase
        .from('task_submissions')
        .select(`
          *,
          tasks (
            category,
            tasker_payout
          )
        `)
        .eq('bidder_id', session.user.id)
        .eq('status', 'approved');

      if (error) throw error;

      return data.reduce((total, submission) => {
        return total + (submission.tasks?.tasker_payout || 0);
      }, 0);
    },
    enabled: !!session?.user?.id,
    refetchInterval: 30000
  });

  const metrics = [
    { 
      label: "Available Bids", 
      value: userProfile?.bids || 0,
      description: "Use them wisely to secure tasks" 
    },
    { 
      label: "Available Tasks", 
      value: availableTasks,
      description: "Tasks waiting for bids" 
    },
    {
      label: "Available Balance",
      value: `KES ${userProfile?.pending_payouts || 0}`,
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