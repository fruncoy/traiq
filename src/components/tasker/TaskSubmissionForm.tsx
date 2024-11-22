import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Task } from "@/types/task";

const TaskSubmissionForm = () => {
  const [selectedTask, setSelectedTask] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const currentTasker = JSON.parse(localStorage.getItem('currentTasker') || '{}');

  // Get only tasks that haven't been submitted by this tasker
  const { data: activeTasks = [] } = useQuery({
    queryKey: ['user-active-tasks', currentTasker.id],
    queryFn: async () => {
      const tasks = localStorage.getItem(`userActiveTasks_${currentTasker.id}`);
      const allTasks = tasks ? JSON.parse(tasks) : [];
      const submissions = JSON.parse(localStorage.getItem('taskSubmissions') || '[]');
      
      // Filter out tasks that have already been submitted by this tasker
      return allTasks.filter((task: Task) => {
        const hasSubmitted = submissions.some((s: any) => 
          s.taskId === task.id && s.bidderId === currentTasker.id
        );
        return !hasSubmitted;
      });
    }
  });

  const { mutate: submitTask, isPending } = useMutation({
    mutationFn: async (task: Task) => {
      if (!file) throw new Error("No file selected");
      if (file.size > 10 * 1024 * 1024) throw new Error("File size exceeds 10MB limit");

      const submission = {
        id: `submission-${Date.now()}`,
        taskId: task.id,
        taskCode: task.code,
        taskTitle: task.title,
        bidderId: currentTasker.id,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        fileName: file.name
      };

      // Store submission
      const submissions = JSON.parse(localStorage.getItem('taskSubmissions') || '[]');
      submissions.push(submission);
      localStorage.setItem('taskSubmissions', JSON.stringify(submissions));

      // Update task submissions
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const updatedTasks = tasks.map((t: Task) => {
        if (t.id === task.id) {
          return {
            ...t,
            submissions: [...(t.submissions || []), submission]
          };
        }
        return t;
      });
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));

      // Store submission for tasker
      const taskerSubmissions = JSON.parse(localStorage.getItem(`taskSubmissions_${currentTasker.id}`) || '[]');
      taskerSubmissions.push(submission);
      localStorage.setItem(`taskSubmissions_${currentTasker.id}`, JSON.stringify(taskerSubmissions));

      return submission;
    },
    onSuccess: () => {
      toast.success("Task submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ['user-active-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-submissions'] });
      setSelectedTask("");
      setFile(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit task");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) {
      toast.error("Please select a task");
      return;
    }
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const task = activeTasks.find((t: Task) => t.id === selectedTask);
    if (task) {
      submitTask(task);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Task</label>
        <Select value={selectedTask} onValueChange={setSelectedTask}>
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Select a task to submit" />
          </SelectTrigger>
          <SelectContent position="popper" className="w-full max-h-[300px] overflow-y-auto bg-white">
            {activeTasks.length === 0 ? (
              <SelectItem value="none" disabled>No active tasks</SelectItem>
            ) : (
              activeTasks.map((task: Task) => (
                <SelectItem 
                  key={task.id} 
                  value={task.id}
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{task.title}</span>
                    <span className="text-sm text-gray-500">{task.code}</span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Upload File (Max 10MB)</label>
        <Input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          accept=".pdf,.doc,.docx,.txt"
          className="bg-white"
        />
      </div>

      <Button 
        type="submit" 
        disabled={!selectedTask || !file || isPending}
        className="w-full"
      >
        {isPending ? "Processing..." : "Submit Task"}
      </Button>
    </form>
  );
};

export default TaskSubmissionForm;