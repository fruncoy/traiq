import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Sidebar from "../Sidebar";
import { useQuery } from "@tanstack/react-query";
import TaskSubmissionForm from "./TaskSubmissionForm";

const SubmitTaskPage = () => {
  const { data: submissions = [] } = useQuery({
    queryKey: ['task-submissions'],
    queryFn: async () => {
      const subs = localStorage.getItem('taskSubmissions');
      return subs ? JSON.parse(subs) : [];
    },
    refetchInterval: 5000
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
                    className="p-4 border rounded-lg bg-white"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-[#1E40AF]">{submission.taskTitle}</h3>
                        <p className="text-sm text-gray-600">File: {submission.fileName}</p>
                      </div>
                      <Badge
                        variant={submission.status === 'approved' ? 'default' : 'secondary'}
                        className={submission.status === 'approved' ? 'bg-[#1E40AF] text-white' : ''}
                      >
                        {submission.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{new Date(submission.submittedAt).toLocaleString()}</p>
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