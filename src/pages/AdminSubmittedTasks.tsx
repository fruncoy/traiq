import Sidebar from "../components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubmittedTask {
  id: string;
  taskTitle: string;
  submittedBy: string;
  submittedDate: string;
  status: "pending" | "approved" | "rejected";
}

const submittedTasks: SubmittedTask[] = [
  {
    id: "1",
    taskTitle: "Translate Short Stories",
    submittedBy: "John Doe",
    submittedDate: "2024-02-20",
    status: "pending"
  }
];

const AdminSubmittedTasks = () => {
  const handleStatusChange = (taskId: string, status: string) => {
    // Handle status change logic here
    console.log(`Task ${taskId} status changed to ${status}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Submitted Tasks</h2>
          </div>

          <div className="grid gap-4">
            {submittedTasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{task.taskTitle}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Submitted by: {task.submittedBy}
                      </p>
                      <p className="text-sm text-gray-600">
                        Date: {task.submittedDate}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Select onValueChange={(value) => handleStatusChange(task.id, value)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="approved">Approve</SelectItem>
                          <SelectItem value="rejected_incomplete">Reject - Incomplete</SelectItem>
                          <SelectItem value="rejected_quality">Reject - Poor Quality</SelectItem>
                          <SelectItem value="rejected_guidelines">Reject - Not Following Guidelines</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

export default AdminSubmittedTasks;