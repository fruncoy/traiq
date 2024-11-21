import { Task, TaskSubmission } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface SubmissionCardProps {
  task: Task;
  submission: TaskSubmission;
  rating: number;
  onRatingChange: (value: number) => void;
  onAction: (action: 'approved' | 'rejected', reason?: string) => void;
  isPending: boolean;
}

const SubmissionCard = ({
  task,
  submission,
  rating,
  onRatingChange,
  onAction,
  isPending
}: SubmissionCardProps) => {
  return (
    <Card className="p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-[#1E40AF]">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.code}</p>
          <p className="text-sm text-gray-600">Tasker ID: {submission.bidderId}</p>
          <p className="text-sm text-gray-600">File: {submission.fileName}</p>
          <p className="text-xs text-gray-500">
            Submitted: {new Date(submission.submittedAt || '').toLocaleString()}
          </p>
        </div>

        {submission.status === 'pending' ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Rating (60-80)</p>
              <Slider
                value={[rating]}
                onValueChange={(value) => onRatingChange(value[0])}
                min={60}
                max={80}
                step={1}
                className="w-full"
              />
              <p className="text-sm text-center">{rating}%</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => onAction('approved')}
                disabled={isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve
              </Button>
              <Select onValueChange={(reason) => onAction('rejected', reason)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason to reject" />
                </SelectTrigger>
                <SelectContent>
                  {["Plagiarism", "Poor Quality", "Incomplete Work", "Late Submission", "Incorrect Format", "Other"].map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="flex justify-end">
            <Badge
              variant={submission.status === 'approved' ? 'default' : 'secondary'}
              className={submission.status === 'approved' ? 'bg-[#1E40AF] text-white' : ''}
            >
              {submission.status}
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SubmissionCard;