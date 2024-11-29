import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Task, TaskCategory, TaskSubmission } from "@/types/task";
import { supabase } from "@/integrations/supabase/client";
import { format, isAfter, parseISO } from "date-fns";
import { formatInTimeZone } from 'date-fns-tz';

interface TaskWithSubmissions extends Task {
  task_submissions: Pick<TaskSubmission, 'id' | 'bidder_id' | 'status' | 'submitted_at'>[];
  task_bidders: {
    bidder_id: string;
    bid_date: string;
  }[];
}

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
        .filter((task: TaskWithSubmissions) => {
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
  
  const getDeadline = (bidDate: string) => {
    const bidTime = parseISO(bidDate);
    const bidHour = parseInt(formatInTimeZone(bidTime, 'Africa/Nairobi', 'HH'));
    
    if (bidHour >= 17) {
      const deadline = new Date(bidTime);
      deadline.setDate(deadline.getDate() + 1);
      deadline.setHours(16, 0, 0, 0);
      return deadline;
    } else {
      const deadline = new Date(bidTime);
      deadline.setHours(16, 0, 0, 0);
      return deadline;
    }
  };

  const isSubmissionAllowed = () => {
    if (!taskBidder?.bid_date) return false;
    const deadline = getDeadline(taskBidder.bid_date);
    return !isAfter(now, deadline);
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
        {taskBidder?.bid_date && (
          <p className={`text-sm ${!isSubmissionAllowed() ? 'text-red-500' : 'text-gray-500'}`}>
            Deadline: {format(getDeadline(taskBidder.bid_date), 'MMM d, yyyy h:mm a')} EAT
          </p>
        )}
      </div>

      <Button 
        type="submit" 
        disabled={!selectedTask || !file || submitTaskMutation.isPending || !isSubmissionAllowed()}
        className="w-full bg-primary hover:bg-primary/90"
      >
        {submitTaskMutation.isPending ? "Processing..." : "Submit Task"}
      </Button>
    </form>
  );
};

export default TaskSubmissionForm;
