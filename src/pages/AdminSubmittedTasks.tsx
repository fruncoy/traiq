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
      return tasks ? JSON.parse(tasks) : [];
    },
    refetchInterval: 1000
  });

  // Get all tasks that have submissions
  const tasksWithSubmissions = tasks.filter((task: Task) => 
    task.submissions && task.submissions.length > 0
  );

  // Calculate total submissions across all tasks
  const totalSubmissions = tasksWithSubmissions.reduce((acc: number, task: Task) => 
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
        const updatedTaskers = taskers.map((t: any) => {
          if (t.id === bidderId) {
            return {
              ...t,
              balance: (t.balance || 0) + task.taskerPayout
            };
          }
          return t;
        });
        localStorage.setItem('taskers', JSON.stringify(updatedTaskers));
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
      toast.success("Submission status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update submission status");
    }
  });

  const handleAction = (taskId: string, bidderId: string, action: 'approved' | 'rejected', reason?: string) => {
    handleSubmissionAction({ taskId, bidderId, action, reason });
  };

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
                    <TaskSubmissionsTable
                      task={task}
                      onAction={handleAction}
                      isPending={isPending}
                      allSubmissions={tasksWithSubmissions.flatMap(t => t.submissions || [])}
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