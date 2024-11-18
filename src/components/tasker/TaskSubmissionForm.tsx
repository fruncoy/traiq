import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { processTaskSubmission } from "../task/TaskBidLogic";
import { Task } from "@/types/task";

const TaskSubmissionForm = () => {
  const [selectedTask, setSelectedTask] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { data: activeTasks = [] } = useQuery({
    queryKey: ['user-active-tasks'],
    queryFn: async () => {
      const tasks = localStorage.getItem('userActiveTasks');
      return tasks ? JSON.parse(tasks) : [];
    }
  });

  const { mutate: submitTask, isPending } = useMutation({
    mutationFn: async (task: Task) => {
      const result = await processTaskSubmission(task);
      const userActiveTasks = JSON.parse(localStorage.getItem('userActiveTasks') || '[]');
      const updatedTasks = userActiveTasks.filter((t: Task) => t.id !== task.id);
      localStorage.setItem('userActiveTasks', JSON.stringify(updatedTasks));
      return result;
    },
    onSuccess: (result) => {
      toast.success("Task submitted successfully!", {
        description: `Your submission has been processed. Rating: ${result.rating}%`
      });
      queryClient.invalidateQueries({ queryKey: ['user-active-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-submissions'] });
      setSelectedTask("");
      setFile(null);
    },
    onError: () => {
      toast.error("Failed to submit task", {
        description: "Please try again later."
      });
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
          <SelectTrigger>
            <SelectValue placeholder="Select a task to submit" />
          </SelectTrigger>
          <SelectContent>
            {activeTasks.length === 0 ? (
              <SelectItem value="none" disabled>No active tasks</SelectItem>
            ) : (
              activeTasks.map((task: Task) => (
                <SelectItem key={task.id} value={task.id}>
                  {task.title} - {task.code}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Upload File</label>
        <Input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          accept=".pdf,.doc,.docx,.txt"
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