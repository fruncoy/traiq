import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Task } from "@/types/task";

const AdminSubmittedTasks = () => {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const queryClient = useQueryClient();

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const tasks = localStorage.getItem('tasks');
      return tasks ? JSON.parse(tasks) : [];
    },
    refetchInterval: 1000 // Poll every second for real-time updates
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
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const task = tasks.find((t: Task) => t.id === taskId);
      
      if (!task) throw new Error("Task not found");
      
      const updatedTasks = tasks.map((t: Task) => {
        if (t.id === taskId) {
          const updatedSubmissions = t.submissions?.map(s => {
            if (s.bidderId === bidderId) {
              return { 
                ...s, 
                status: action,
                ...(reason && { rejectionReason: reason })
              };
            }
            return s;
          });
          return { ...t, submissions: updatedSubmissions };
        }
        return t;
      });
      
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      console.log("Updated tasks after submission action:", updatedTasks);
      
      // Add notification
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.unshift({
        id: Date.now().toString(),
        title: `Submission ${action}`,
        message: `Task ${task.code} submission has been ${action}`,
        type: action === 'approved' ? 'success' : 'error',
        read: false,
        date: new Date().toISOString()
      });
      localStorage.setItem('notifications', JSON.stringify(notifications));
      
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#1E40AF]">Task Submissions ({totalSubmissions})</h2>
          </div>

          <div className="space-y-6">
            {tasksWithSubmissions.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-gray-500">No submissions yet</p>
                </CardContent>
              </Card>
            ) : (
              tasksWithSubmissions.map((task: Task) => (
                <Card key={task.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="text-lg">
                      Task: {task.title} (Code: {task.code})
                      <span className="ml-2 text-sm font-normal text-gray-600">
                        {task.submissions?.length} submission{task.submissions?.length !== 1 ? 's' : ''}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tasker ID</TableHead>
                          <TableHead>File</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
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
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                submission.status === 'approved' 
                                  ? 'bg-green-100 text-green-800'
                                  : submission.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {submission.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              {submission.status === 'pending' && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleSubmissionAction({
                                      taskId: task.id,
                                      bidderId: submission.bidderId,
                                      action: 'approved'
                                    })}
                                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                                    disabled={isPending}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleSubmissionAction({
                                      taskId: task.id,
                                      bidderId: submission.bidderId,
                                      action: 'rejected',
                                      reason: 'Rejected by admin'
                                    })}
                                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                                    disabled={isPending}
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

export default AdminSubmittedTasks;
