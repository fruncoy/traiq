import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SubmissionStatus } from "@/types/task";
import { toast } from "sonner";

export const useSubmissionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      taskId, 
      bidderId, 
      action, 
      reason 
    }: { 
      taskId: string; 
      bidderId: string; 
      action: SubmissionStatus; 
      reason?: string 
    }) => {
      // Get task details first
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select('code, title')
        .eq('id', taskId)
        .single();

      if (taskError) throw taskError;

      // Update submission status
      const { error: submissionError } = await supabase
        .from('task_submissions')
        .update({ 
          status: action,
          rejection_reason: reason 
        })
        .eq('task_id', taskId)
        .eq('bidder_id', bidderId);

      if (submissionError) throw submissionError;

      // Update tasker stats if approved
      if (action === 'approved') {
        const { error: statsError } = await supabase.rpc('update_tasker_stats', {
          p_tasker_id: bidderId,
          p_task_id: taskId
        });
        if (statsError) throw statsError;
      }

      // Create notification with meaningful message
      const notificationMessage = action === 'approved'
        ? `Your submission for task ${taskData.code} (${taskData.title}) has been approved`
        : `Your submission for task ${taskData.code} (${taskData.title}) has been ${action}${reason ? `. Reason: ${reason}` : ''}`;

      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: bidderId,
          title: `Task ${action === 'approved' ? 'Approved' : 'Rejected'}`,
          message: notificationMessage,
          type: 'task_review'
        });

      if (notificationError) throw notificationError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      toast.success('Submission updated successfully');
    },
    onError: (error) => {
      console.error('Submission update error:', error);
      toast.error('Failed to update submission');
    }
  });
};