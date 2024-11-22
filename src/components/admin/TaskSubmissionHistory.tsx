import { CheckCircle, Circle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface TaskSubmissionHistoryProps {
  taskerId: string;
}

export const TaskSubmissionHistory = ({ taskerId }: TaskSubmissionHistoryProps) => {
  const { data: submissions = [] } = useQuery({
    queryKey: ['tasker-submissions-history', taskerId],
    queryFn: async () => {
      const allSubmissions = JSON.parse(localStorage.getItem('taskSubmissions') || '[]');
      return allSubmissions
        .filter((s: any) => s.bidderId === taskerId)
        .sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
        .slice(0, 5);
    }
  });

  const circles = Array(5).fill(null);

  return (
    <div className="flex gap-2">
      {circles.map((_, index) => {
        const submission = submissions[index];
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