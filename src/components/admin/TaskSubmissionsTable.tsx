import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Task, TaskSubmission, SubmissionStatus } from "@/types/task";
import { SubmissionRow } from "./submission/SubmissionRow";
import { useSubmissionMutation } from "./submission/useSubmissionMutation";
import { useSubmissionsQuery } from "./submission/useSubmissionsQuery";

export interface TaskSubmissionsTableProps {
  task: Task;
}

export const TaskSubmissionsTable = ({ task }: TaskSubmissionsTableProps) => {
  const { 
    data: submissions = [], 
    isLoading,
    refetch,
    isRefetching
  } = useSubmissionsQuery(task.id);
  
  const submissionMutation = useSubmissionMutation();

  const handleAction = async (bidderId: string, action: 'approved' | 'rejected', reason?: string) => {
    await submissionMutation.mutateAsync({ 
      taskId: task.id, 
      bidderId, 
      action, 
      reason 
    });
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isRefetching}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div>Loading submissions...</div>
      ) : (
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
                onAction={(action, reason) => handleAction(submission.bidder_id, action as 'approved' | 'rejected', reason)}
                isPending={submissionMutation.isPending}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};