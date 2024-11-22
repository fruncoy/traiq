import { Circle, CheckCircle } from "lucide-react";

interface TaskerSubmissionHistoryProps {
  submissions: any[];
  taskerId: string;
}

export const TaskerSubmissionHistory = ({ submissions, taskerId }: TaskerSubmissionHistoryProps) => {
  // Get last 5 submissions for this tasker
  const lastFiveSubmissions = submissions
    .filter(s => s.bidderId === taskerId)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  // Fill remaining slots with empty circles
  const circles = Array(5).fill(null);

  return (
    <div className="flex gap-2">
      {circles.map((_, index) => {
        const submission = lastFiveSubmissions[index];
        const isApproved = submission?.status === 'approved';
        const hasSubmission = !!submission;

        return (
          <div
            key={index}
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isApproved ? 'bg-green-500' : 
              hasSubmission ? 'bg-blue-500' : 
              'bg-gray-200'
            }`}
            title={submission ? `Task: ${submission.taskCode} - ${submission.status}` : 'No submission'}
          >
            {isApproved ? (
              <CheckCircle className="w-3 h-3 text-white" />
            ) : (
              <Circle className="w-3 h-3 text-white" />
            )}
          </div>
        );
      })}
    </div>
  );
};