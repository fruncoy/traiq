import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Task } from "@/types/task";
import { useState } from "react";
import { approveSubmission } from "../components/task/TaskBidLogic";

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
  const [rating, setRating] = useState<number>(70);

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const tasks = localStorage.getItem('tasks');
      return tasks ? JSON.parse(tasks) : [];
    }
  });

  const { mutate: handleSubmissionAction } = useMutation({
    mutationFn: async ({ taskId, bidderId, action, reason, rating }: { 
      taskId: string; 
      bidderId: string; 
      action: 'approved' | 'rejected'; 
      reason?: string;
      rating?: number;
    }) => {
      if (action === 'approved') {
        return approveSubmission(taskId, bidderId);
      }

      // Handle rejection logic
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const updatedTasks = tasks.map((task: Task) => {
        if (task.id === taskId) {
          const submission = task.submissions?.find(s => s.bidderId === bidderId);
          if (submission) {
            submission.status = 'rejected';
            submission.rejectionReason = reason;
          }
        }
        return task;
      });
      
      // Update task submissions
      const taskSubmissions = JSON.parse(localStorage.getItem('taskSubmissions') || '[]');
      const updatedTaskSubmissions = taskSubmissions.map((submission: any) => {
        if (submission.taskId === taskId) {
          return { ...submission, status: 'rejected', rejectionReason: reason };
        }
        return submission;
      });
      localStorage.setItem('taskSubmissions', JSON.stringify(updatedTaskSubmissions));
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return updatedTasks;
    },
    onSuccess: () => {
      // Invalidate all relevant queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['user-earnings'] });
      queryClient.invalidateQueries({ queryKey: ['total-earned'] });
      queryClient.invalidateQueries({ queryKey: ['potential-payouts'] });
      toast.success("Submission status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update submission status");
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
                      <div className="space-y-4">
                        <h3 className="font-semibold">Submissions:</h3>
                        {task.submissions?.map((submission) => (
                          <div key={submission.bidderId} className="border p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm text-gray-600">
                                  Submitted: {new Date(submission.submittedAt || '').toLocaleString()}
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
                                  <div className="space-y-4">
                                    <div className="w-[200px]">
                                      <p className="text-sm font-medium mb-2">Rating (60-80)</p>
                                      <Slider
                                        value={[rating]}
                                        onValueChange={(value) => setRating(value[0])}
                                        min={60}
                                        max={80}
                                        step={1}
                                        className="mb-4"
                                      />
                                      <p className="text-sm text-gray-600 text-center">{rating}%</p>
                                    </div>
                                    <Button
                                      onClick={() => handleSubmissionAction({
                                        taskId: task.id,
                                        bidderId: submission.bidderId,
                                        action: 'approved',
                                        rating
                                      })}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      Approve
                                    </Button>
                                  </div>
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
                                  {submission.rating && ` (${submission.rating}%)`}
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