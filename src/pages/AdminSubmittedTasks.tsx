import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Task } from "@/types/task";

const rejectionReasons = [
  "Plagiarism",
  "Poor Quality",
  "Incomplete Work",
  "Late Submission",
  "Incorrect Format",
  "Other"
];

const AdminSubmittedTasks = () => {
  const queryClient = useQueryClient();

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const tasks = localStorage.getItem('tasks');
      return tasks ? JSON.parse(tasks) : [];
    }
  });

  const { mutate: handleSubmissionAction } = useMutation({
    mutationFn: async ({ taskId, bidderId, action, reason }: { taskId: string; bidderId: string; action: 'approved' | 'rejected'; reason?: string }) => {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const updatedTasks = tasks.map((task: Task) => {
        if (task.id === taskId) {
          const submission = task.submissions?.find(s => s.bidderId === bidderId);
          if (submission) {
            submission.status = action;
            if (reason) {
              submission.rejectionReason = reason;
            }
          }
        }
        return task;
      });
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return updatedTasks;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Submission status updated successfully");
    }
  });

  const tasksWithSubmissions = tasks.filter((task: Task) => task.submissions && task.submissions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin>
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-bold">Task Submissions</h2>
          
          {tasksWithSubmissions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No submissions yet</p>
          ) : (
            <div className="space-y-6">
              {tasksWithSubmissions.map((task: Task) => (
                <Card key={task.id}>
                  <CardHeader>
                    <CardTitle>{task.title} - {task.code}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-4">
                        <h3 className="font-semibold">Bidders:</h3>
                        {task.bidders.map((bidderId: string, index: number) => (
                          <div key={bidderId} className="flex items-center gap-2">
                            <span>Tasker {index + 1} (ID: {bidderId})</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold">Submissions:</h3>
                        {task.submissions?.map((submission) => (
                          <div key={submission.bidderId} className="border p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">Tasker ID: {submission.bidderId}</p>
                                <p className="text-sm text-gray-600">
                                  Submitted: {new Date(submission.submittedAt).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-600">
                                  File: {submission.fileName}
                                </p>
                                {submission.rejectionReason && (
                                  <p className="text-sm text-red-600">
                                    Rejection Reason: {submission.rejectionReason}
                                  </p>
                                )}
                              </div>
                              {submission.status === 'pending' && (
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleSubmissionAction({
                                      taskId: task.id,
                                      bidderId: submission.bidderId,
                                      action: 'approved'
                                    })}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Approve
                                  </Button>
                                  <div className="flex gap-2">
                                    <Select
                                      onValueChange={(reason) => 
                                        handleSubmissionAction({
                                          taskId: task.id,
                                          bidderId: submission.bidderId,
                                          action: 'rejected',
                                          reason
                                        })
                                      }
                                    >
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
                                  </div>
                                </div>
                              )}
                              {submission.status !== 'pending' && (
                                <span className={`px-2 py-1 rounded text-sm ${
                                  submission.status === 'approved' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Sidebar>
    </div>
  );
};

export default AdminSubmittedTasks;