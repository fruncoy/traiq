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
import { toast } from "sonner";

interface SubmittedTask {
  id: string;
  taskTitle: string;
  submittedBy: string;
  submittedDate: string;
  description: string;
  attachments: string[];
  status: "pending" | "approved" | "rejected";
}

const submittedTasks: SubmittedTask[] = [
  {
    id: "1",
    taskTitle: "Translate Short Stories",
    submittedBy: "John Doe",
    submittedDate: "2024-02-20",
    description: "Translated 5 short stories from English to Spanish",
    attachments: ["story1.pdf", "story2.pdf"],
    status: "pending"
  },
  {
    id: "2",
    taskTitle: "Data Entry Project",
    submittedBy: "Jane Smith",
    submittedDate: "2024-02-19",
    description: "Completed data entry for 200 records",
    attachments: ["data_sheet.xlsx"],
    status: "pending"
  }
];

const AdminSubmittedTasks = () => {
  const handleStatusChange = (taskId: string, status: string) => {
    toast.success(`Task ${taskId} status updated to ${status}`);
  };

  const handleDownload = (filename: string) => {
    toast.info(`Downloading ${filename}`);
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
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
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
                        <Select 
                          onValueChange={(value) => handleStatusChange(task.id, value)}
                          defaultValue={task.status}
                        >
                          <SelectTrigger className="w-[200px]">
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

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-gray-700">{task.description}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Attachments</h4>
                      <div className="flex gap-2 flex-wrap">
                        {task.attachments.map((file, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="text-blue-600 bg-white hover:bg-blue-50"
                            onClick={() => handleDownload(file)}
                          >
                            {file}
                          </Button>
                        ))}
                      </div>
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