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
      const { error } = await supabase
        .from('task_submissions')
        .update({ 
          status: action,
          rejection_reason: reason 
        })
        .eq('task_id', taskId)
        .eq('bidder_id', bidderId);

      if (error) throw error;

      // Update tasker stats if approved
      if (action === 'approved') {
        const { error: rpcError } = await supabase.rpc('update_tasker_stats', {
          p_tasker_id: bidderId,
          p_task_id: taskId
        });
        if (rpcError) throw rpcError;
      }

      // Create notification with correct user_id
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: bidderId, // Set this to the bidder's ID
          title: `Submission ${action}`,
          message: `Your submission has been ${action}${reason ? ` (Reason: ${reason})` : ''}`,
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