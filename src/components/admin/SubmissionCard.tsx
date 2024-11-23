import { Task, TaskSubmission } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TaskSubmissionHistory } from "./TaskSubmissionHistory";
import { SubmissionActions } from "./SubmissionActions";

interface SubmissionCardProps {
  task: Task;
  submission: TaskSubmission;
  onAction: (action: 'approved' | 'rejected', reason?: string) => void;
  isPending: boolean;
}

const SubmissionCard = ({
  task,
  submission,
  onAction,
  isPending
}: SubmissionCardProps) => {
  return (
    <Card className="p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-[#1E40AF]">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.code}</p>
          <p className="text-sm text-gray-600">Tasker ID: {submission.bidder_id}</p>
          <p className="text-sm text-gray-600">File: {submission.file_name}</p>
          <p className="text-xs text-gray-500">
            Submitted: {new Date(submission.submitted_at || '').toLocaleString()}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Badge
              variant={submission.status === 'approved' ? 'default' : 'secondary'}
              className={submission.status === 'approved' ? 'bg-[#1E40AF] text-white' : ''}
            >
              {submission.status}
            </Badge>
            <TaskSubmissionHistory taskerId={submission.bidder_id} />
          </div>

          {submission.status === 'pending' && (
            <SubmissionActions onAction={onAction} isPending={isPending} />
          )}
        </div>
      </div>
    </Card>
  );
};

export default SubmissionCard;