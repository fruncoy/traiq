import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Task } from "@/types/task";
import { supabase } from "@/integrations/supabase/client";
import { format, isAfter, set, addDays } from "date-fns";
import { formatInTimeZone } from 'date-fns-tz';

const TaskSubmissionForm = () => {
  const [selectedTask, setSelectedTask] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const checkDeadline = (bidDate: string) => {
    const now = new Date();
    const eatTime = formatInTimeZone(now, 'Africa/Nairobi', 'yyyy-MM-dd HH:mm:ssXXX');
    const bidDateTime = new Date(bidDate);
    const submissionDeadline = set(addDays(bidDateTime, 1), { hours: 16, minutes: 0, seconds: 0 });
    
    // Check if it's between Thursday 4 PM and Friday 8 AM
    const dayOfWeek = now.getDay(); // 4 is Thursday, 5 is Friday
    const hour = now.getHours();
    
    if ((dayOfWeek === 4 && hour >= 16) || (dayOfWeek === 5 && hour < 8)) {
      return { allowed: false, message: "Submissions are not allowed between Thursday 4 PM and Friday 8 AM." };
    }
    
    return {
      allowed: !isAfter(new Date(eatTime), submissionDeadline),
      message: `Submission deadline: ${format(submissionDeadline, 'MMM d, yyyy h:mm a')} EAT`
    };
  };

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
            bidder_id,
            status
          )
        `)
        .eq('task_bidders.bidder_id', user.id)
        .eq('status', 'active');

      if (error) throw error;

      return tasks.filter(task => {
        const hasSubmitted = task.task_submissions?.some(
          (s: any) => s.bidder_id === user.id
        );
        return !hasSubmitted;
      });
    }
  });

  const submitTaskMutation = useMutation({
    mutationFn: async ({ task, file }: { task: Task, file: File }) => {
      const taskBidder = task.task_bidders?.find(b => b.bid_date);
      if (!taskBidder?.bid_date) throw new Error("Bid date not found");
      
      const deadlineCheck = checkDeadline(taskBidder.bid_date);
      if (!deadlineCheck.allowed) {
        throw new Error(deadlineCheck.message);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${task.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('task-submissions')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create submission record
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

    const task = activeTasks.find((t: Task) => t.id === selectedTask);
    if (task) {
      submitTaskMutation.mutate({ task, file });
    }
  };

  const selectedTaskData = activeTasks.find((t: Task) => t.id === selectedTask);
  const taskBidder = selectedTaskData?.task_bidders?.find(b => b.bid_date);
  const deadlineInfo = taskBidder ? checkDeadline(taskBidder.bid_date) : null;

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
        {deadlineInfo && (
          <p className={`text-sm ${!deadlineInfo.allowed ? 'text-red-500' : 'text-gray-500'}`}>
            {deadlineInfo.message}
          </p>
        )}
      </div>

      <Button 
        type="submit" 
        disabled={!selectedTask || !file || submitTaskMutation.isPending || (deadlineInfo && !deadlineInfo.allowed)}
        className="w-full bg-primary hover:bg-primary/90"
      >
        {submitTaskMutation.isPending ? "Processing..." : "Submit Task"}
      </Button>
    </form>
  );
};

export default TaskSubmissionForm;