import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Task } from "@/types/task";
import { processTaskSubmission } from "../task/TaskBidLogic";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    }
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ['task-submissions'],
    queryFn: async () => {
      const subs = localStorage.getItem('taskSubmissions');
      return subs ? JSON.parse(subs) : [];
    }
  });

  const availableTasks = activeTasks.filter((task: Task) => 
    !submissions.some((sub: any) => sub.taskId === task.id) &&
    task.status === "active"
  );

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

      toast.loading("Processing submission...", { duration: 10000 });
      const processedTask = await processTaskSubmission(task);

      const submissions = JSON.parse(localStorage.getItem('taskSubmissions') || '[]');
      const submission = {
        id: Date.now().toString(),
        taskId: selectedTask,
        taskTitle: task.title,
        taskCode: task.code,
        fileName: file.name,
        submittedAt: new Date().toISOString(),
        status: 'approved',
        payout: processedTask.payout,
        rating: processedTask.rating
      };
      
      submissions.push(submission);
      localStorage.setItem('taskSubmissions', JSON.stringify(submissions));

      queryClient.invalidateQueries({ queryKey: ['task-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      toast.success("Task submitted successfully!", {
        description: "Your submission is being processed. Check MY SUBMISSIONS for status."
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
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Task</label>
          <Select value={selectedTask} onValueChange={setSelectedTask}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select a task to submit" />
            </SelectTrigger>
            <SelectContent>
              {availableTasks.length === 0 ? (
                <SelectItem value="none" disabled>No tasks available</SelectItem>
              ) : (
                availableTasks.map((task: Task) => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.title} - {task.code}
                  </SelectItem>
                ))
              )}
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
              className="bg-[#1E40AF] hover:bg-[#1E40AF]/90 flex items-center gap-2"
            >
              <Upload size={16} />
              {uploading ? "Uploading..." : "Submit"}
            </Button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">MY SUBMISSIONS</h2>
        {submissions.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No submissions yet</p>
        ) : (
          <div className="grid gap-4">
            {submissions.map((submission: any) => (
              <Card key={submission.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{submission.taskTitle}</h3>
                      <p className="text-sm text-gray-600">ID: {submission.taskCode}</p>
                      <p className="text-sm text-gray-600">File: {submission.fileName}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-2">
                        Rating: {submission.rating}%
                      </Badge>
                      <p className="text-sm font-semibold text-green-600">
                        Payout: KES {submission.payout}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {format(new Date(submission.submittedAt), "MMM d, yyyy h:mm a")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskSubmissionForm;