import { Button } from "@/components/ui/button";

interface SubmissionActionsProps {
  onAction: (action: 'approved' | 'rejected') => void;
  isPending: boolean;
}

export const SubmissionActions = ({ onAction, isPending }: SubmissionActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => onAction('approved')}
        disabled={isPending}
        variant="default"
        size="sm"
      >
        Approve
      </Button>
      <Button
        onClick={() => onAction('rejected')}
        disabled={isPending}
        variant="destructive"
        size="sm"
      >
        Reject
      </Button>
    </div>
  );
};