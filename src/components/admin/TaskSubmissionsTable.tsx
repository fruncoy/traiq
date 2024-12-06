import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Task, TaskSubmission, SubmissionStatus } from "@/types/task";
import { SubmissionRow } from "./submission/SubmissionRow";
import { useSubmissionMutation } from "./submission/useSubmissionMutation";
import { useSubmissionsQuery } from "./submission/useSubmissionsQuery";

export interface TaskSubmissionsTableProps {
  task: Task;
}

export const TaskSubmissionsTable = ({ task }: TaskSubmissionsTableProps) => {
  const { data: submissions = [], isLoading } = useSubmissionsQuery(task.id);
  const submissionMutation = useSubmissionMutation();

  if (isLoading) {
    return <div>Loading submissions...</div>;
  }

  const handleAction = (bidderId: string, action: 'approved' | 'rejected', reason?: string) => {
    submissionMutation.mutate({ 
      taskId: task.id, 
      bidderId, 
      action: action as SubmissionStatus, 
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
        {submissions.map((submission: TaskSubmission) => (
          <SubmissionRow
            key={`${submission.task_id}-${submission.bidder_id}`}
            submission={submission}
            onAction={(action, reason) => handleAction(submission.bidder_id, action, reason)}
            isPending={submissionMutation.isPending}
          />
        ))}
      </TableBody>
    </Table>
  );
};