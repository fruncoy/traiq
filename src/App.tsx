import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TaskerDashboard from "./pages/TaskerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTasks from "./pages/AdminTasks";
import AdminTaskers from "./pages/AdminTaskers";
import AdminTickets from "./pages/AdminTickets";
import AdminSubmittedTasks from "./pages/AdminSubmittedTasks";
import BiddedTasksPage from "./components/tasker/BiddedTasksPage";
import SubmitTaskPage from "./components/tasker/SubmitTaskPage";
import NotificationsPage from "./components/tasker/NotificationsPage";
import BuyBidsPage from "./components/tasker/BuyBidsPage";
import MyTickets from "./components/tasker/MyTickets";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasker" element={<TaskerDashboard />} />
        <Route path="/tasker/tasks" element={<TaskerDashboard />} />
        <Route path="/tasker/bidding" element={<TaskerDashboard />} />
        <Route path="/tasker/buy-bids" element={<BuyBidsPage />} />
        <Route path="/tasker/settings" element={<TaskerDashboard />} />
        <Route path="/tasker/notifications" element={<NotificationsPage />} />
        <Route path="/tasker/bidded-tasks" element={<BiddedTasksPage />} />
        <Route path="/tasker/submit/:taskId" element={<SubmitTaskPage />} />
        <Route path="/tasker/tickets" element={<MyTickets />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/tasks" element={<AdminTasks />} />
        <Route path="/admin/taskers" element={<AdminTaskers />} />
        <Route path="/admin/tickets" element={<AdminTickets />} />
        <Route path="/admin/submitted-tasks" element={<AdminSubmittedTasks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;