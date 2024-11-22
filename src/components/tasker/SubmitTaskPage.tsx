import Sidebar from "../Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import TaskSubmissionForm from "./TaskSubmissionForm";

const SubmitTaskPage = () => {
  const currentTasker = JSON.parse(localStorage.getItem('currentTasker') || '{}');

  const { data: submissions = [] } = useQuery({
    queryKey: ['task-submissions', currentTasker.id],
    queryFn: async () => {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const subs = localStorage.getItem(`taskSubmissions_${currentTasker.id}`);
      const userSubmissions = subs ? JSON.parse(subs) : [];
      
      // Map submissions to include their current status from tasks
      return userSubmissions.map((sub: any) => {
        const task = tasks.find((t: any) => t.id === sub.taskId);
        const taskSubmission = task?.submissions?.find((s: any) => 
          s.bidderId === currentTasker.id && s.id === sub.id
        );
        return {
          ...sub,
          status: taskSubmission?.status || sub.status
        };
      });
    },
    refetchInterval: 1000
  });

  return (
    <Sidebar>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Submit Task</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskSubmissionForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {submissions.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No submissions yet</p>
              ) : (
                submissions.map((submission: any) => (
                  <div
                    key={submission.id}
                    className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="space-y-2 flex-1">
                        <h3 className="font-semibold text-[#1E40AF]">{submission.taskTitle}</h3>
                        <p className="text-sm text-gray-600">Task ID: {submission.taskId}</p>
                        <p className="text-sm text-gray-600">File: {submission.fileName}</p>
                        <p className="text-xs text-gray-500">
                          Submitted: {new Date(submission.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          variant={submission.status === 'approved' ? 'default' : 'secondary'}
                          className={submission.status === 'approved' ? 'bg-[#1E40AF] text-white' : ''}
                        >
                          {submission.status}
                        </Badge>
                        {submission.status === 'approved' && submission.rating && (
                          <span className="text-sm text-green-600">Rating: {submission.rating}%</span>
                        )}
                        {submission.status === 'rejected' && submission.rejectionReason && (
                          <span className="text-sm text-red-600">
                            Reason: {submission.rejectionReason}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
};

export default SubmitTaskPage;