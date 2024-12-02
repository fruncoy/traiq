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
      const { error } = await supabase
        .from('task_submissions')
        .update({ 
          status: action,
          ...(reason && { rejection_reason: reason })
        })
        .eq('task_id', taskId)
        .eq('bidder_id', bidderId);

      if (error) throw error;

      if (action === 'approved') {
        const { error: rpcError } = await supabase.rpc('update_tasker_stats', {
          p_tasker_id: bidderId,
          p_task_id: taskId
        });
        if (rpcError) throw rpcError;
      }

      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: bidderId,
          title: `Submission ${action}`,
          message: `Your submission has been ${action}${reason ? ` (Reason: ${reason})` : ''}`,
          type: 'task_review'
        });

      if (notificationError) throw notificationError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-submissions'] });
      toast.success("Submission status updated successfully");
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast.error("Failed to update submission status");
    }
  });
};