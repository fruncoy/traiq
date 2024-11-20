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
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const tasks = localStorage.getItem('tasks');
      return tasks ? JSON.parse(tasks) : [];
    }
  });

  const { mutate: handleSubmissionAction } = useMutation({
    mutationFn: async ({ taskId, bidderId, action, reason }: { 
      taskId: string; 
      bidderId: string; 
      action: 'approved' | 'rejected'; 
      reason?: string;
    }) => {
      if (action === 'approved') {
        return approveSubmission(taskId, bidderId, ratings[`${taskId}-${bidderId}`]);
      }

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
      
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return updatedTasks;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['user-earnings'] });
      queryClient.invalidateQueries({ queryKey: ['total-earned'] });
      toast.success("Submission status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update submission status");
    }
  });

  const tasksWithSubmissions = tasks.filter((task: Task) => task.submissions && task.submissions.length > 0);

  const handleRatingChange = (taskId: string, bidderId: string, value: number) => {
    setRatings(prev => ({
      ...prev,
      [`${taskId}-${bidderId}`]: value
    }));
  };

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
                <Card key={task.id} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>{task.title} - {task.code}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {task.submissions?.map((submission) => (
                        <div 
                          key={`${task.id}-${submission.bidderId}`}
                          className="border rounded-lg p-4 space-y-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-gray-600">Submission Details</p>
                              <p className="text-sm">Tasker ID: {submission.bidderId}</p>
                              <p className="text-sm">File: {submission.fileName}</p>
                              <p className="text-sm">
                                Submitted: {new Date(submission.submittedAt || '').toLocaleString()}
                              </p>
                            </div>

                            {submission.status === 'pending' && (
                              <>
                                <div className="space-y-2">
                                  <p className="text-sm font-medium text-gray-600">Rating (60-80)</p>
                                  <Slider
                                    value={[ratings[`${task.id}-${submission.bidderId}`] || 70]}
                                    onValueChange={(value) => handleRatingChange(task.id, submission.bidderId, value[0])}
                                    min={60}
                                    max={80}
                                    step={1}
                                    className="w-full"
                                  />
                                  <p className="text-sm text-center">
                                    {ratings[`${task.id}-${submission.bidderId}`] || 70}%
                                  </p>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex flex-col sm:flex-row gap-2">
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
                                      <SelectTrigger>
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
                              </>
                            )}

                            {submission.status !== 'pending' && (
                              <div className="col-span-2">
                                <div className={`inline-flex px-3 py-1 rounded-full text-sm ${
                                  submission.status === 'approved' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                  {submission.rating && ` (${submission.rating}%)`}
                                  {submission.rejectionReason && ` - ${submission.rejectionReason}`}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
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