import { TaskSubmission } from "@/types/task";
import { TableCell, TableRow } from "@/components/ui/table";
import { SubmissionStatus } from "./SubmissionStatus";
import { SubmissionActions } from "./SubmissionActions";
import { SubmissionHistory } from "./SubmissionHistory";

interface SubmissionRowProps {
  submission: TaskSubmission & {
    profiles?: {
      username: string;
      email: string;
    };
  };
  onAction: (bidderId: string, action: 'approved' | 'rejected', reason?: string) => void;
  isPending: boolean;
}

export const SubmissionRow = ({ submission, onAction, isPending }: SubmissionRowProps) => {
  return (
    <TableRow>
      <TableCell>{submission.bidder_id}</TableCell>
      <TableCell>{submission.profiles?.username || 'Unknown'}</TableCell>
      <TableCell>
        <a 
          href={submission.file_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {submission.file_name}
        </a>
      </TableCell>
      <TableCell>
        {new Date(submission.submitted_at).toLocaleString()}
      </TableCell>
      <TableCell>
        <SubmissionStatus status={submission.status} />
      </TableCell>
      <TableCell>
        <SubmissionHistory 
          taskerId={submission.bidder_id}
        />
      </TableCell>
      <TableCell>
        {submission.status === 'pending' && (
          <SubmissionActions
            onAction={(action) => onAction(submission.bidder_id, action)}
            isPending={isPending}
          />
        )}
      </TableCell>
    </TableRow>
  );
};