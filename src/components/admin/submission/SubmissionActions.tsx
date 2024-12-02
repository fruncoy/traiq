import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface SubmissionActionsProps {
  onAction: (action: 'approved' | 'rejected', reason?: string) => void;
  isPending: boolean;
}

export const SubmissionActions = ({ onAction, isPending }: SubmissionActionsProps) => {
  const [showRejectReasons, setShowRejectReasons] = useState(false);
  
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
      {!showRejectReasons ? (
        <Button
          onClick={() => setShowRejectReasons(true)}
          disabled={isPending}
          variant="destructive"
        >
          Reject
        </Button>
      ) : (
        <Select onValueChange={(reason) => onAction('rejected', reason)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select reason to reject" />
          </SelectTrigger>
          <SelectContent>
            {rejectionReasons.map((reason) => (
              <SelectItem key={reason} value={reason}>
                {reason}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};