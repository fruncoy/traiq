import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import Sidebar from "../Sidebar";

interface SubmittedTask {
  id: string;
  title: string;
  submittedAt: string;
  status: "accepted" | "failed";
  reason?: string;
  file?: string;
}

const submittedTasks: SubmittedTask[] = [
  {
    id: "1",
    title: "Translate Short Stories",
    submittedAt: "2024-02-20",
    status: "accepted",
    file: "translation.pdf"
  },
  {
    id: "2",
    title: "Cultural Essays",
    submittedAt: "2024-02-19",
    status: "failed",
    reason: "Low quality translation"
  }
];

const SubmitTaskPage = () => {
  const [selectedTask, setSelectedTask] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!selectedTask) {
      toast.error("Please select a task");
      return;
    }
    toast.success("Task submitted successfully");
  };

  return (
    <Sidebar>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Submit Task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <select
              className="w-full p-2 border rounded-md"
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
            >
              <option value="">Select Task</option>
              <option value="1">Translate Short Stories</option>
              <option value="2">Cultural Essays</option>
            </select>

            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <Button variant="outline">Upload File</Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                PDF, DOC, DOCX up to 10MB
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder="Add any notes or comments about your submission"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <Button onClick={handleSubmit} className="w-full">
              Submit Task
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submission History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {submittedTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-gray-500">Submitted: {task.submittedAt}</p>
                    {task.reason && (
                      <p className="text-sm text-red-500">Reason: {task.reason}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {task.file && (
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    )}
                    <Badge
                      variant={task.status === "accepted" ? "default" : "destructive"}
                    >
                      {task.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
};

export default SubmitTaskPage;
