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

        // Update task status to completed
        const { error: taskError } = await supabase
          .from('tasks')
          .update({ status: 'completed' })
          .eq('id', taskId);

        if (taskError) throw taskError;
      }

      // Create notification
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: bidderId,
          title: `Submission ${action}`,
          message: `Your submission has been ${action}${reason ? ` (Reason: ${reason})` : ''}`,
          type: action === 'approved' ? 'success' : 'error'
        });

      if (notificationError) throw notificationError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Submission updated successfully');
    },
    onError: (error) => {
      console.error('Submission update error:', error);
      toast.error('Failed to update submission');
    }
  });
};