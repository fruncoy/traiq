import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/task";
import { SubmissionRow } from "./submission/SubmissionRow";

interface TaskSubmissionsTableProps {
  task: Task;
  onAction: (taskId: string, bidderId: string, action: 'approved' | 'rejected', reason?: string) => void;
  isPending: boolean;
}

export const TaskSubmissionsTable = ({ task, onAction, isPending }: TaskSubmissionsTableProps) => {
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
      return data;
    }
  });

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
            onAction={(bidderId, action, reason) => 
              onAction(task.id, bidderId, action, reason)}
            isPending={isPending}
          />
        ))}
      </TableBody>
    </Table>
  );
};