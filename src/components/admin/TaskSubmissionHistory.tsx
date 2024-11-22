import { CheckCircle, XCircle } from "lucide-react";

interface TaskSubmissionHistoryProps {
  taskerId: string;
}

export const TaskSubmissionHistory = ({ taskerId }: TaskSubmissionHistoryProps) => {
  const submissions = JSON.parse(localStorage.getItem('taskSubmissions') || '[]')
    .filter((s: any) => s.bidderId === taskerId)
    .slice(0, 5);

  return (
    <div className="flex gap-2">
      {submissions.length > 0 ? (
        submissions.map((submission: any, index: number) => (
          <div
            key={index}
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              submission.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
            }`}
            title={`Task: ${submission.taskCode} - ${submission.status}`}
          >
            {submission.status === 'approved' ? (
              <CheckCircle className="w-3 h-3 text-white" />
            ) : (
              <XCircle className="w-3 h-3 text-white" />
            )}
          </div>
        ))
      ) : (
        Array(5).fill(null).map((_, index) => (
          <div
            key={index}
            className="w-6 h-6 rounded-full bg-gray-200"
            title="No previous submissions"
          />
        ))
      )}
    </div>
  );
};