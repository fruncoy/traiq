import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Task } from "@/types/task";
import { processTaskSubmission } from "../task/TaskBidLogic";

const TaskSubmissionForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: activeTasks = [] } = useQuery({
    queryKey: ['user-active-tasks'],
    queryFn: async () => {
      const tasks = localStorage.getItem('userActiveTasks');
      return tasks ? JSON.parse(tasks) : [];
    },
    refetchInterval: 5000 // Real-time updates
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ['task-submissions'],
    queryFn: async () => {
      const subs = localStorage.getItem('taskSubmissions');
      return subs ? JSON.parse(subs) : [];
    },
    refetchInterval: 5000 // Real-time updates
  });

  // Filter out tasks that have already been submitted
  const availableTasks = activeTasks.filter((task: Task) => 
    !submissions.some((sub: any) => sub.taskId === task.id) &&
    task.status === "active"
  );

  const selectedTaskDetails = availableTasks.find((task: Task) => task.id === selectedTask);

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
      const task = activeTasks.find((t: Task) => t.id === selectedTask);
      if (!task) throw new Error("Task not found");

      const submissions = JSON.parse(localStorage.getItem('taskSubmissions') || '[]');
      const submission = {
        id: Date.now().toString(),
        taskId: selectedTask,
        taskTitle: task.title,
        fileName: file.name,
        submittedAt: new Date().toISOString(),
        status: 'pending',
        payout: task.taskerPayout
      };
      
      submissions.push(submission);
      localStorage.setItem('taskSubmissions', JSON.stringify(submissions));

      // Process the submission with delay
      toast.loading("Processing submission...", { duration: 40000 });
      await processTaskSubmission(task);

      // Update notifications and activities
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.unshift({
        id: Date.now().toString(),
        title: "Task Submitted",
        message: `Your submission for "${task.title}" is being processed`,
        type: "info",
        date: new Date().toISOString()
      });
      localStorage.setItem('notifications', JSON.stringify(notifications));

      const activities = JSON.parse(localStorage.getItem('activities') || '[]');
      activities.unshift({
        id: Date.now().toString(),
        type: "submission",
        message: `Task "${task.title}" has been submitted and is being processed`,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('activities', JSON.stringify(activities));

      queryClient.invalidateQueries({ queryKey: ['task-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      toast.success("Task submitted successfully!", {
        description: "Your submission is being processed. Payment will be processed shortly."
      });
      
      setFile(null);
      setSelectedTask("");
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      toast.error("Failed to submit task. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Task</label>
        <Select value={selectedTask} onValueChange={setSelectedTask}>
          <SelectTrigger className="w-full bg-white border-[#1E40AF] text-[#1E40AF]">
            <SelectValue placeholder="Select a task to submit" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {availableTasks.length === 0 ? (
              <SelectItem value="none" disabled>No tasks available</SelectItem>
            ) : (
              availableTasks.map((task: Task) => (
                <SelectItem key={task.id} value={task.id}>
                  {task.title} - KES {task.taskerPayout}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {selectedTaskDetails && (
          <p className="text-sm text-gray-600">
            Payout: KES {selectedTaskDetails.taskerPayout}
          </p>
        )}
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
            className="bg-[#1E40AF] hover:bg-[#1E40AF]/90 flex items-center gap-2"
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
  );
};

export default TaskSubmissionForm;
