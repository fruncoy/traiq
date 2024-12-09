import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TaskTable } from "@/components/admin/task/TaskTable";
import { TaskList } from "@/components/admin/task/TaskList";
import { TaskUpload } from "@/components/admin/task/TaskUpload";
import { useTaskMutations } from "@/hooks/admin/useTaskMutations";
import { toast } from "sonner";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminTasks = () => {
  const navigate = useNavigate();
  const { resetSystemMutation, deleteMutation, toggleStatusMutation, uploadMutation } = useTaskMutations();

  // Check authentication and admin status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      if (!profile?.is_admin) {
        toast.error("Unauthorized access");
        navigate('/');
      }
    };

    checkAuth();
  }, [navigate]);

  const { data: availableTasks = [], isLoading } = useQuery({
    queryKey: ['admin-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          code,
          title,
          description,
          category,
          payout,
          tasker_payout,
          platform_fee,
          bids_needed,
          max_bidders,
          current_bids,
          deadline,
          status
        `);

      if (error) {
        toast.error("Failed to fetch tasks");
        throw error;
      }

      return data || [];
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Task Management</h1>
          <div className="space-x-4">
            <TaskUpload onUpload={uploadMutation.mutate} />
          </div>
        </div>

        <TaskList tasks={availableTasks} />
        
        <TaskTable 
          tasks={availableTasks}
          onDelete={deleteMutation.mutate}
          onToggleStatus={toggleStatusMutation.mutate}
          onResetSystem={resetSystemMutation.mutate}
        />
      </div>
    </div>
  );
};

export default AdminTasks;