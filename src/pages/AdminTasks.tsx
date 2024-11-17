import Sidebar from "../components/Sidebar";
import TaskList from "../components/TaskList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AdminTasks = () => {
  const handleAddTask = () => {
    // Handle add task logic here
    console.log("Add task clicked");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Tasks Management</h2>
            <Button onClick={handleAddTask} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Task
            </Button>
          </div>
          <TaskList isAdmin={true} />
        </div>
      </Sidebar>
    </div>
  );
};

export default AdminTasks;