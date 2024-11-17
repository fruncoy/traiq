import Navbar from "../components/Navbar";
import DashboardMetrics from "../components/DashboardMetrics";
import TaskList from "../components/TaskList";

const TaskerDashboard = () => {
  const metrics = [
    { label: "Available Bids", value: "8" },
    { label: "Active Tasks", value: "3" },
    { label: "Total Earned", value: "$890" },
  ];

  const tasks = [
    {
      id: "1",
      title: "Hindi Voice Recording",
      description: "Record 100 Hindi phrases for AI training",
      payout: 50,
      deadline: "2024-02-28",
      status: "active",
    },
    {
      id: "2",
      title: "Bengali Text Translation",
      description: "Translate 200 English sentences to Bengali",
      payout: 75,
      deadline: "2024-03-01",
      status: "active",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-8">Tasker Dashboard</h1>
        <DashboardMetrics metrics={metrics} />
        <TaskList tasks={tasks} />
      </main>
    </div>
  );
};

export default TaskerDashboard;