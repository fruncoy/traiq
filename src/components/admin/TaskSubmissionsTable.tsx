import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Task } from "@/types/task";
import { SubmissionRow } from "./submission/SubmissionRow";
import { useSubmissionMutation } from "./submission/useSubmissionMutation";
import { useSubmissionsQuery } from "./submission/useSubmissionsQuery";

interface TaskSubmissionsTableProps {
  task: Task;
}

export const TaskSubmissionsTable = ({ task }: TaskSubmissionsTableProps) => {
  const { data: submissions = [] } = useSubmissionsQuery(task.id);
  const submissionMutation = useSubmissionMutation();

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
            onAction={(action, reason) => 
              submissionMutation.mutate({ 
                taskId: task.id, 
                bidderId: submission.bidder_id, 
                action, 
                reason 
              })
            }
            isPending={submissionMutation.isPending}
          />
        ))}
      </TableBody>
    </Table>
  );
};