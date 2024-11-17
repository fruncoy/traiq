import Sidebar from "../components/Sidebar";
import TaskList from "../components/TaskList";

const AdminTasks = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Tasks Management</h2>
          <TaskList />
        </div>
      </Sidebar>
    </div>
  );
};

export default AdminTasks;