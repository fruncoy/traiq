import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { processTaskSubmission } from "../task/TaskBidLogic";
import { Task, TaskSubmission } from "@/types/task";

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
      console.log("Submitting task:", task);
      if (!file) {
        throw new Error("No file selected");
      }

      const submission: TaskSubmission = {
        id: `submission-${Date.now()}`,
        bidderId: 'current-user-id',
        status: 'pending',
        submittedAt: new Date().toISOString(),
        fileName: file.name
      };

      console.log("Processing submission:", submission);
      await processTaskSubmission(task, submission);

      // Update local storage after successful submission
      const userActiveTasks = JSON.parse(localStorage.getItem('userActiveTasks') || '[]');
      const updatedTasks = userActiveTasks.filter((t: Task) => t.id !== task.id);
      localStorage.setItem('userActiveTasks', JSON.stringify(updatedTasks));
      
      return { task, submission };
    },
    onSuccess: ({ task }) => {
      console.log("Task submitted successfully:", task);
      toast.success("Task submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ['user-active-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-submissions'] });
      setSelectedTask("");
      setFile(null);
    },
    onError: (error: Error) => {
      console.error("Task submission failed:", error);
      toast.error(error.message || "Failed to submit task");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with task:", selectedTask);

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
    } else {
      toast.error("Selected task not found");
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
                  className="py-3 px-4 hover:bg-gray-100 cursor-pointer text-gray-900"
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
        <label className="text-sm font-medium">Upload File</label>
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