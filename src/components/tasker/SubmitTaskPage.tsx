import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "../Sidebar";

const SubmitTaskPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const { data: activeTasks = [] } = useQuery({
    queryKey: ['active-tasks'],
    queryFn: async () => {
      const tasks = localStorage.getItem('activeTasks');
      return tasks ? JSON.parse(tasks) : [];
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) {
      toast.error("Please select a task");
      return;
    }
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setUploading(true);
    try {
      // Store submission in localStorage
      const submissions = JSON.parse(localStorage.getItem('taskSubmissions') || '[]');
      submissions.push({
        id: Date.now().toString(),
        taskId: selectedTask,
        taskTitle: activeTasks.find(t => t.id === selectedTask)?.title,
        fileName: file.name,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      });
      localStorage.setItem('taskSubmissions', JSON.stringify(submissions));
      
      toast.success("Task submitted successfully!", {
        description: "Your submission will be reviewed by our team."
      });
      setFile(null);
      setSelectedTask("");
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      toast.error("Failed to submit task. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Sidebar>
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Submit Completed Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Task</label>
                <Select value={selectedTask} onValueChange={setSelectedTask}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a task to submit" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeTasks.map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        {task.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload Task File</label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={!selectedTask || !file || uploading}
                    className="flex items-center gap-2"
                  >
                    <Upload size={16} />
                    {uploading ? "Uploading..." : "Submit"}
                  </Button>
                </div>
                {file && (
                  <p className="text-sm text-gray-600">
                    Selected file: {file.name}
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
};

export default SubmitTaskPage;