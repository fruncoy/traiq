import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Task } from "@/types/task";
import { TaskSubmissionsTable } from "@/components/admin/TaskSubmissionsTable";

const AdminSubmittedTasks = () => {
  const queryClient = useQueryClient();

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const tasks = localStorage.getItem('tasks');
      const parsedTasks = tasks ? JSON.parse(tasks) : [];
      // Return all tasks that have any submissions
      return parsedTasks.filter((task: Task) => 
        task.submissions && task.submissions.length > 0
      );
    },
    refetchInterval: 1000
  });

  // Calculate total submissions across all tasks
  const totalSubmissions = tasks.reduce((acc: number, task: Task) => 
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
      
      // Update task submissions
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
      
      // Update tasker's balance if approved
      if (action === 'approved') {
        const taskers = JSON.parse(localStorage.getItem('taskers') || '[]');
        const payout = task.category === 'genai' ? 700 : 300;
        
        const updatedTaskers = taskers.map((t: any) => {
          if (t.id === bidderId) {
            return {
              ...t,
              balance: (t.balance || 0) + payout,
              completedTasks: (t.completedTasks || 0) + 1,
              totalEarnings: (t.totalEarnings || 0) + payout
            };
          }
          return t;
        });
        localStorage.setItem('taskers', JSON.stringify(updatedTaskers));

        // Update current tasker if it's the same user
        const currentTasker = JSON.parse(localStorage.getItem('currentTasker') || '{}');
        if (currentTasker.id === bidderId) {
          const updatedCurrentTasker = {
            ...currentTasker,
            balance: (currentTasker.balance || 0) + payout,
            completedTasks: (currentTasker.completedTasks || 0) + 1,
            totalEarnings: (currentTasker.totalEarnings || 0) + payout
          };
          localStorage.setItem('currentTasker', JSON.stringify(updatedCurrentTasker));
        }

        // Update earnings in userEarnings
        const userEarnings = JSON.parse(localStorage.getItem('userEarnings') || '{}');
        userEarnings[bidderId] = (userEarnings[bidderId] || 0) + payout;
        localStorage.setItem('userEarnings', JSON.stringify(userEarnings));
      }

      // Add notification for the tasker
      const notifications = JSON.parse(localStorage.getItem(`notifications_${bidderId}`) || '[]');
      notifications.unshift({
        id: Date.now().toString(),
        title: `Submission ${action}`,
        message: `Task ${task.code} submission has been ${action}`,
        type: action === 'approved' ? 'success' : 'error',
        read: false,
        date: new Date().toISOString(),
        taskerId: bidderId
      });
      localStorage.setItem(`notifications_${bidderId}`, JSON.stringify(notifications));
      
      return updatedTasks;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['taskers'] });
      queryClient.invalidateQueries({ queryKey: ['user-earnings'] });
      queryClient.invalidateQueries({ queryKey: ['total-earned'] });
      queryClient.invalidateQueries({ queryKey: ['user-active-tasks'] });
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
            <h2 className="text-2xl font-bold text-[#1E40AF]">
              Task Submissions ({totalSubmissions})
            </h2>
          </div>

          <div className="space-y-6">
            {tasks.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-gray-500">No submissions yet</p>
                </CardContent>
              </Card>
            ) : (
              tasks.map((task: Task) => (
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
                    <TaskSubmissionsTable
                      task={task}
                      onAction={(taskId, bidderId, action, reason) => 
                        handleSubmissionAction({ taskId, bidderId, action, reason })}
                      isPending={isPending}
                      allSubmissions={tasks.flatMap(t => t.submissions || [])}
                    />
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