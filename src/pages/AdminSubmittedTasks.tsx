import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Task } from "@/types/task";
import { approveSubmission } from "../components/task/TaskBidLogic";
import SubmissionCard from "../components/admin/SubmissionCard";

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
  const submissionsByTask = tasksWithSubmissions.reduce((acc, task) => {
    if (!acc[task.code]) {
      acc[task.code] = {
        task,
        submissions: task.submissions || []
      };
    }
    return acc;
  }, {} as Record<string, { task: Task, submissions: any[] }>);

  console.log("Tasks with submissions:", tasksWithSubmissions);
  console.log("Total submissions:", totalSubmissions);
  console.log("Submissions grouped by task:", submissionsByTask);

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
              {Object.entries(submissionsByTask).length === 0 ? (
                <p className="text-center text-gray-500 py-4">No submissions yet</p>
              ) : (
                Object.entries(submissionsByTask).map(([taskCode, { task, submissions }]) => (
                  <div key={taskCode} className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Task: {task.title} (Code: {taskCode}) - {submissions.length} submissions
                    </h3>
                    <div className="space-y-4">
                      {submissions.map((submission) => (
                        <SubmissionCard
                          key={`${task.id}-${submission.bidderId}`}
                          task={task}
                          submission={submission}
                          rating={ratings[`${task.id}-${submission.bidderId}`] || 70}
                          onRatingChange={(value) => handleRatingChange(task.id, submission.bidderId, value)}
                          onAction={(action, reason) => 
                            handleSubmissionAction({
                              taskId: task.id,
                              bidderId: submission.bidderId,
                              action,
                              reason
                            })
                          }
                          isPending={isPending}
                        />
                      ))}
                    </div>
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