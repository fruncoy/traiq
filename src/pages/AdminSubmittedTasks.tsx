import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Task } from "@/types/task";
import { approveSubmission } from "../components/task/TaskBidLogic";

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

  // Filter tasks that have submissions
  const tasksWithSubmissions = tasks.filter((task: Task) => 
    task.submissions && task.submissions.length > 0
  );

  const totalSubmissions = tasksWithSubmissions.reduce((acc, task) => 
    acc + (task.submissions?.length || 0), 0
  );

  const { mutate: handleSubmissionAction, isPending } = useMutation({
    mutationFn: async ({ taskId, bidderId, action, reason }: { 
      taskId: string; 
      bidderId: string; 
      action: 'approved' | 'rejected'; 
      reason?: string;
    }) => {
      if (action === 'approved') {
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
              {tasksWithSubmissions.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No submissions yet</p>
              ) : (
                tasksWithSubmissions.map((task: Task) => (
                  <div key={task.id} className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">
                      Task: {task.title} (Code: {task.code}) - {task.submissions?.length} submissions
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
                        {task.submissions?.map((submission) => (
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
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
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
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                    disabled={isPending}
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className={`px-3 py-1 rounded ${
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