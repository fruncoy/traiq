import Navbar from "../components/Navbar";
import DashboardMetrics from "../components/DashboardMetrics";
import TaskList from "../components/TaskList";

const AdminDashboard = () => {
  const metrics = [
    { label: "Total Tasks", value: "156", change: "+12% from last month" },
    { label: "Active Submissions", value: "43", change: "+5% from last month" },
    { label: "Total Earnings", value: "$12,543", change: "+18% from last month" },
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
      status: "assigned",
    },
    {
      id: "3",
      title: "Tamil Speech Verification",
      description: "Verify accuracy of Tamil speech recordings",
      payout: 60,
      deadline: "2024-03-05",
      status: "completed",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-8">Admin Dashboard</h1>
        <DashboardMetrics metrics={metrics} />
        <TaskList tasks={tasks} />
      </main>
    </div>
  );
};

export default AdminDashboard;