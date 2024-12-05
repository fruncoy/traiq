import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TaskSelect } from "./TaskSelect";
import { isSubmissionAllowed } from "@/utils/deadlineUtils";
import { FileUploadSection } from "./FileUploadSection";
import { useParams, useNavigate } from "react-router-dom";

const TaskSubmissionForm = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState(taskId || "");
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { data: activeTasks = [] } = useQuery({
    queryKey: ['user-active-tasks'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: tasksData, error } = await supabase
        .from('tasks')
        .select(`
          *,
          task_bidders!inner(
            bidder_id,
            bid_date
          ),
          task_submissions(
            bidder_id,
            status
          )
        `)
        .eq('task_bidders.bidder_id', user.id)
        .eq('status', 'pending');

      if (error) throw error;

      return tasksData.filter((task: any) => {
        const hasApprovedOrPendingSubmission = task.task_submissions?.some(
          (s: any) => s.bidder_id === user.id && s.status !== 'rejected'
        );
        return !hasApprovedOrPendingSubmission;
      }).map((task: any) => ({
        ...task,
        bidders: task.task_bidders || [],
        submissions: task.task_submissions || []
      }));
    },
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  const submitTaskMutation = useMutation({
    mutationFn: async ({ task, file }: { task: any, file: File }) => {
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

      // Create notification for submission
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'Task Submitted',
          message: `Your submission for task ${task.code} has been received and is pending review.`,
          type: 'task_submission'
        });

      if (notificationError) throw notificationError;
    },
    onSuccess: () => {
      toast.success("Task submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ['user-active-tasks'] });
      navigate('/tasker/bidded-tasks');
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit task");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !file) {
      toast.error(!selectedTask ? "Please select a task" : "Please select a file");
      return;
    }

    const task = activeTasks.find(t => t.id === selectedTask);
    if (task) {
      submitTaskMutation.mutate({ task, file });
    }
  };

  const selectedTaskData = activeTasks.find(t => t.id === selectedTask);
  const taskBidder = selectedTaskData?.bidders?.find(b => b.bid_date);
  const deadline = taskBidder?.bid_date ? new Date(taskBidder.bid_date) : undefined;
  const isDeadlineApproaching = deadline && 
    (deadline.getTime() - new Date().getTime()) < 2 * 60 * 60 * 1000;

  if (isDeadlineApproaching) {
    toast.warning(`Deadline approaching for task submission! Due by ${deadline?.toLocaleString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TaskSelect 
        tasks={activeTasks}
        selectedTask={selectedTask}
        onSelect={setSelectedTask}
      />

      <FileUploadSection
        file={file}
        onFileChange={setFile}
        isDeadlineApproaching={!!isDeadlineApproaching}
        deadline={deadline}
      />

      <Button 
        type="submit" 
        disabled={!selectedTask || !file || submitTaskMutation.isPending || (deadline && !isSubmissionAllowed(deadline.toISOString()))}
        className="w-full bg-primary hover:bg-primary/90"
      >
        {submitTaskMutation.isPending ? "Processing..." : "Submit Task"}
      </Button>
    </form>
  );
};

export default TaskSubmissionForm;