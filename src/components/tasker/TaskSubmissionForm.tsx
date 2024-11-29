import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Task, TaskCategory } from "@/types/task";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { formatInTimeZone } from 'date-fns-tz';
import { TaskSelect } from "./TaskSelect";
import { getDeadline, isSubmissionAllowed } from "@/utils/deadlineUtils";

type TaskWithBidders = Task & {
  task_bidders: {
    bidder_id: string;
    bid_date: string;
  }[];
};

const TaskSubmissionForm = () => {
  const [selectedTask, setSelectedTask] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { data: activeTasks = [] } = useQuery({
    queryKey: ['user-active-tasks'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: tasks, error } = await supabase
        .from('tasks')
        .select(`
          *,
          task_bidders!inner (
            bidder_id,
            bid_date
          ),
          task_submissions!left (
            id,
            bidder_id,
            status,
            submitted_at
          )
        `)
        .eq('task_bidders.bidder_id', user.id)
        .eq('status', 'active')
        .neq('status', 'expired');

      if (error) throw error;

      return tasks
        .filter((task: TaskWithBidders) => {
          const hasSubmitted = task.task_submissions?.some(s => s.bidder_id === user.id);
          return !hasSubmitted;
        })
        .map((task: any) => ({
          ...task,
          category: task.category as TaskCategory
        }));
    },
    refetchInterval: 30000
  });

  const submitTaskMutation = useMutation({
    mutationFn: async ({ task, file }: { task: Task, file: File }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${task.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('task-submissions')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: submissionError } = await supabase
        .from('task_submissions')
        .insert({
          task_id: task.id,
          bidder_id: user.id,
          file_name: file.name,
          file_url: fileName,
          status: 'pending'
        });

      if (submissionError) throw submissionError;
    },
    onSuccess: () => {
      toast.success("Task submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ['user-active-tasks'] });
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

    const task = activeTasks.find(t => t.id === selectedTask);
    if (task) {
      submitTaskMutation.mutate({ task, file });
    }
  };

  const selectedTaskData = activeTasks.find(t => t.id === selectedTask);
  const taskBidder = selectedTaskData?.task_bidders?.find(b => b.bid_date);
  const now = new Date();
  const eatTime = formatInTimeZone(now, 'Africa/Nairobi', 'HH:mm');
  const [hours] = eatTime.split(':').map(Number);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TaskSelect 
        tasks={activeTasks}
        selectedTask={selectedTask}
        onSelect={setSelectedTask}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">Upload File (Max 10MB)</label>
        <Input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          accept=".pdf,.doc,.docx,.txt"
          className="bg-white"
        />
        {taskBidder?.bid_date && (
          <p className={`text-sm ${!isSubmissionAllowed(taskBidder.bid_date) ? 'text-red-500' : 'text-gray-500'}`}>
            Deadline: {format(getDeadline(taskBidder.bid_date), 'MMM d, yyyy h:mm a')} EAT
          </p>
        )}
      </div>

      <Button 
        type="submit" 
        disabled={!selectedTask || !file || submitTaskMutation.isPending || !isSubmissionAllowed(taskBidder?.bid_date)}
        className="w-full bg-primary hover:bg-primary/90"
      >
        {submitTaskMutation.isPending ? "Processing..." : "Submit Task"}
      </Button>
    </form>
  );
};

export default TaskSubmissionForm;