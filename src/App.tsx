import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { initializeDefaultTasks } from "./utils/initializeData";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTasks from "./pages/AdminTasks";
import AdminSubmittedTasks from "./pages/AdminSubmittedTasks";
import AdminFinances from "./pages/AdminFinances";
import AdminTaskers from "./pages/AdminTaskers";
import AdminSettings from "./pages/AdminSettings";
import TaskerDashboard from "./pages/TaskerDashboard";
import NotificationsPage from "./components/tasker/NotificationsPage";
import BuyBidsPage from "./components/tasker/BuyBidsPage";
import SubmitTaskPage from "./components/tasker/SubmitTaskPage";
import BiddedTasksPage from "./components/tasker/BiddedTasksPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  useEffect(() => {
    if (!localStorage.getItem('tasks')) {
      initializeDefaultTasks();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/tasks" element={<AdminTasks />} />
            <Route path="/admin/submitted-tasks" element={<AdminSubmittedTasks />} />
            <Route path="/admin/finances" element={<AdminFinances />} />
            <Route path="/admin/taskers" element={<AdminTaskers />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/tasker" element={<TaskerDashboard />} />
            <Route path="/tasker/tasks" element={<TaskerDashboard />} />
            <Route path="/tasker/buy-bids" element={<BuyBidsPage />} />
            <Route path="/tasker/notifications" element={<NotificationsPage />} />
            <Route path="/tasker/settings" element={<TaskerDashboard />} />
            <Route path="/tasker/submit-task" element={<SubmitTaskPage />} />
            <Route path="/tasker/bidded-tasks" element={<BiddedTasksPage />} />
          </Routes>
        </BrowserRouter>
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;