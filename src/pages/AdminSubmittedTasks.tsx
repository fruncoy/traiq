import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Task } from "@/types/task";
import { TaskSubmissionsTable } from "@/components/admin/TaskSubmissionsTable";
import { supabase } from "@/integrations/supabase/client";

const AdminSubmittedTasks = () => {
  const queryClient = useQueryClient();

  // Fetch tasks with submissions
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks-with-submissions'],
    queryFn: async () => {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select(`
          *,
          task_submissions (
            *,
            profiles:bidder_id (
              username,
              email
            )
          )
        `)
        .not('task_submissions', 'is', null);

      if (error) throw error;
      return tasks;
    }
  });

  // Calculate total submissions across all tasks
  const totalSubmissions = tasks.reduce((acc: number, task: any) => 
    acc + (task.task_submissions?.length || 0), 0
  );

  const { mutate: handleSubmissionAction, isPending } = useMutation({
    mutationFn: async ({ taskId, bidderId, action, reason }: { 
      taskId: string; 
      bidderId: string; 
      action: 'approved' | 'rejected'; 
      reason?: string;
    }) => {
      const { error } = await supabase
        .from('task_submissions')
        .update({ 
          status: action,
          ...(reason && { rejection_reason: reason })
        })
        .eq('task_id', taskId)
        .eq('bidder_id', bidderId);

      if (error) throw error;

      // If approved, update tasker's stats
      if (action === 'approved') {
        const { error: statsError } = await supabase.rpc('update_tasker_stats', {
          p_tasker_id: bidderId,
          p_task_id: taskId
        });

        if (statsError) throw statsError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks-with-submissions'] });
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
                        {task.task_submissions?.length} submission{task.task_submissions?.length !== 1 ? 's' : ''}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <TaskSubmissionsTable
                      task={task}
                      onAction={(taskId, bidderId, action, reason) => 
                        handleSubmissionAction({ taskId, bidderId, action, reason })}
                      isPending={isPending}
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