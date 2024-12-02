import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface SubmissionActionsProps {
  onAction: (action: 'approved' | 'rejected', reason?: string) => void;
  isPending: boolean;
}

export const SubmissionActions = ({ onAction, isPending }: SubmissionActionsProps) => {
  const rejectionReasons = [
    "Plagiarism",
    "Poor Quality",
    "Incomplete Work",
    "Late Submission",
    "Incorrect Format",
    "Other"
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button
        onClick={() => onAction('approved')}
        disabled={isPending}
        className="bg-green-600 hover:bg-green-700"
      >
        Approve
      </Button>
      <Select onValueChange={(reason) => onAction('rejected', reason)}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select reason to reject" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {rejectionReasons.map((reason) => (
            <SelectItem key={reason} value={reason} className="hover:bg-gray-100">
              {reason}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};