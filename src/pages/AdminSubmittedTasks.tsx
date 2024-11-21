import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Task } from "@/types/task";
import { approveSubmission } from "../components/task/TaskBidLogic";

interface SubmissionsByTask {
  [key: string]: {
    task: Task;
    submissions: any[];
  };
}

const AdminSubmittedTasks = () => {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const queryClient = useQueryClient();

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const tasks = localStorage.getItem('tasks');
      console.log("Retrieved all tasks:", tasks);
      return tasks ? JSON.parse(tasks) : [];
    }
  });

  // Filter tasks that have submissions and count total submissions
  const tasksWithSubmissions = tasks.filter((task: Task) => 
    task.submissions && task.submissions.length > 0
  );

  const totalSubmissions = tasksWithSubmissions.reduce((acc, task) => 
    acc + (task.submissions?.length || 0), 0
  );

  // Group submissions by task code for better organization
  const submissionsByTask: SubmissionsByTask = tasksWithSubmissions.reduce((acc: SubmissionsByTask, task: Task) => {
    if (task.submissions && task.submissions.length > 0) {
      acc[task.code] = {
        task,
        submissions: task.submissions
      };
    }
    return acc;
  }, {} as SubmissionsByTask);

  const { mutate: handleSubmissionAction, isPending } = useMutation({
    mutationFn: async ({ taskId, bidderId, action, reason }: { 
      taskId: string; 
      bidderId: string; 
      action: 'approved' | 'rejected'; 
      reason?: string;
    }) => {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      
      if (action === 'approved') {
        // Store rating before approval
        const updatedTasks = tasks.map((task: Task) => {
          if (task.id === taskId) {
            const submission = task.submissions?.find(s => s.bidderId === bidderId);
            if (submission) {
              submission.rating = ratings[`${taskId}-${bidderId}`];
            }
          }
          return task;
        });
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        console.log("Updated tasks with rating:", updatedTasks);
        
        return approveSubmission(taskId, bidderId);
      }

      // Handle rejection
      const updatedTasks = tasks.map((task: Task) => {
        if (task.id === taskId) {
          const updatedSubmissions = task.submissions?.map(s => {
            if (s.bidderId === bidderId) {
              return { ...s, status: 'rejected', rejectionReason: reason };
            }
            return s;
          });
          return { ...task, submissions: updatedSubmissions };
        }
        return task;
      });
      
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      console.log("Updated tasks after rejection:", updatedTasks);
      return updatedTasks;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Submission status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update submission status");
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin>
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Submissions ({totalSubmissions})</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(submissionsByTask).length === 0 ? (
                <p className="text-center text-gray-500 py-4">No submissions yet</p>
              ) : (
                Object.entries(submissionsByTask).map(([taskCode, { task, submissions }]) => (
                  <div key={taskCode} className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">
                      Task: {task.title} (Code: {taskCode}) - {submissions.length} submissions
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tasker ID</TableHead>
                          <TableHead>File</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions.map((submission) => (
                          <TableRow key={`${task.id}-${submission.bidderId}`}>
                            <TableCell>{submission.bidderId}</TableCell>
                            <TableCell>{submission.fileName}</TableCell>
                            <TableCell>
                              {new Date(submission.submittedAt || '').toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {submission.status === 'pending' ? (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleSubmissionAction({
                                      taskId: task.id,
                                      bidderId: submission.bidderId,
                                      action: 'approved'
                                    })}
                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                    disabled={isPending}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleSubmissionAction({
                                      taskId: task.id,
                                      bidderId: submission.bidderId,
                                      action: 'rejected',
                                      reason: 'Rejected'
                                    })}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                    disabled={isPending}
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className={`px-2 py-1 rounded ${
                                  submission.status === 'approved' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {submission.status}
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </Sidebar>
    </div>
  );
};

export default AdminSubmittedTasks;