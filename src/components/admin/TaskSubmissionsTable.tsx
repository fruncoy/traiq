import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskSubmission } from "@/types/task";
import { SubmissionRow } from "./submission/SubmissionRow";
import { toast } from "sonner";

interface TaskSubmissionsTableProps {
  task: Task;
  onAction: (taskId: string, bidderId: string, action: 'approved' | 'rejected', reason?: string) => void;
  isPending: boolean;
}

export const TaskSubmissionsTable = ({ task, onAction, isPending }: TaskSubmissionsTableProps) => {
  const queryClient = useQueryClient();

  const { data: submissions = [] } = useQuery({
    queryKey: ['task-submissions', task.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('task_submissions')
        .select(`
          *,
          profiles:bidder_id (
            username,
            email
          )
        `)
        .eq('task_id', task.id);

      if (error) throw error;
      return data as (TaskSubmission & {
        profiles?: {
          username: string;
          email: string;
        };
      })[];
    }
  });

  const updateSubmissionMutation = useMutation({
    mutationFn: async ({ 
      taskId, 
      bidderId, 
      action, 
      reason 
    }: { 
      taskId: string; 
      bidderId: string; 
      action: 'approved' | 'rejected'; 
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

      // If approved, update the tasker's stats
      if (action === 'approved') {
        const { error: profileError } = await supabase.rpc('update_tasker_stats', {
          p_tasker_id: bidderId,
          p_task_id: taskId
        });
        if (profileError) throw profileError;
      }

      // Create notification for the tasker
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: bidderId,
          title: `Submission ${action}`,
          message: `Your submission for task ${task.code} has been ${action}${reason ? ` (Reason: ${reason})` : ''}`,
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

  const handleAction = (bidderId: string, action: 'approved' | 'rejected', reason?: string) => {
    updateSubmissionMutation.mutate({ 
      taskId: task.id, 
      bidderId, 
      action, 
      reason 
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tasker ID</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>File</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>History</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((submission) => (
          <SubmissionRow
            key={`${submission.task_id}-${submission.bidder_id}`}
            submission={submission}
            onAction={(action, reason) => handleAction(submission.bidder_id, action, reason)}
            isPending={isPending || updateSubmissionMutation.isPending}
          />
        ))}
      </TableBody>
    </Table>
  );
};