import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTasks from "./pages/AdminTasks";
import AdminBidding from "./pages/AdminBidding";
import AdminFinances from "./pages/AdminFinances";
import AdminTaskers from "./pages/AdminTaskers";
import AdminSettings from "./pages/AdminSettings";
import TaskerDashboard from "./pages/TaskerDashboard";
import NotificationsPage from "./components/tasker/NotificationsPage";
import BuyBidsPage from "./components/tasker/BuyBidsPage";
import SubmitTaskPage from "./components/tasker/SubmitTaskPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/tasks" element={<AdminTasks />} />
          <Route path="/admin/bidding" element={<AdminBidding />} />
          <Route path="/admin/finances" element={<AdminFinances />} />
          <Route path="/admin/taskers" element={<AdminTaskers />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/tasker" element={<TaskerDashboard />} />
          <Route path="/tasker/tasks" element={<TaskerDashboard />} />
          <Route path="/tasker/bidding" element={<TaskerDashboard />} />
          <Route path="/tasker/buy-bids" element={<BuyBidsPage />} />
          <Route path="/tasker/notifications" element={<NotificationsPage />} />
          <Route path="/tasker/settings" element={<TaskerDashboard />} />
          <Route path="/tasker/submit-task" element={<SubmitTaskPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;