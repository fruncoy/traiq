import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { initializeNotifications } from "./utils/notificationManager";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTasks from "./pages/AdminTasks";
import AdminSubmittedTasks from "./pages/AdminSubmittedTasks";
import AdminFinances from "./pages/AdminFinances";
import AdminTaskers from "./pages/AdminTaskers";
import AdminSettings from "./pages/AdminSettings";
import AdminTickets from "./pages/AdminTickets";
import TaskerDashboard from "./pages/TaskerDashboard";
import NotificationsPage from "./components/tasker/NotificationsPage";
import BuyBidsPage from "./components/tasker/BuyBidsPage";
import SubmitTaskPage from "./components/tasker/SubmitTaskPage";
import BiddedTasksPage from "./components/tasker/BiddedTasksPage";
import TaskerAuth from "./pages/TaskerAuth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeNotifications();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/tasker-auth" 
              element={session ? <Navigate to="/tasker" /> : <TaskerAuth />} 
            />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/tasks" element={<AdminTasks />} />
            <Route path="/admin/submitted-tasks" element={<AdminSubmittedTasks />} />
            <Route path="/admin/finances" element={<AdminFinances />} />
            <Route path="/admin/taskers" element={<AdminTaskers />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/tickets" element={<AdminTickets />} />
            <Route 
              path="/tasker" 
              element={session ? <TaskerDashboard /> : <Navigate to="/tasker-auth" />} 
            />
            <Route 
              path="/tasker/tasks" 
              element={session ? <TaskerDashboard /> : <Navigate to="/tasker-auth" />} 
            />
            <Route 
              path="/tasker/buy-bids" 
              element={session ? <BuyBidsPage /> : <Navigate to="/tasker-auth" />} 
            />
            <Route 
              path="/tasker/notifications" 
              element={session ? <NotificationsPage /> : <Navigate to="/tasker-auth" />} 
            />
            <Route 
              path="/tasker/settings" 
              element={session ? <TaskerDashboard /> : <Navigate to="/tasker-auth" />} 
            />
            <Route 
              path="/tasker/submit-task" 
              element={session ? <SubmitTaskPage /> : <Navigate to="/tasker-auth" />} 
            />
            <Route 
              path="/tasker/bidded-tasks" 
              element={session ? <BiddedTasksPage /> : <Navigate to="/tasker-auth" />} 
            />
          </Routes>
        </BrowserRouter>
        <Sonner 
          position="bottom-right"
          expand={true}
          closeButton={true}
          richColors={true}
          theme="light"
          className="!fixed !bottom-4 !right-4"
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
          }}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;