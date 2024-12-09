import Sidebar from "../components/Sidebar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Task, TaskCategory } from "@/types/task";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskList } from "@/components/admin/task/TaskList";
import { TaskUpload } from "@/components/admin/task/TaskUpload";
import { useTaskMutations } from "@/hooks/admin/useTaskMutations";
import { toast } from "sonner";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminTasks = () => {
  const navigate = useNavigate();
  const { resetSystemMutation, deleteMutation, toggleStatusMutation, uploadMutation } = useTaskMutations();

  // Check authentication status
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
      const { data: tasksData, error } = await supabase
        .from('tasks')
        .select(`
          *,
          task_bidders!left (
            bidder_id
          ),
          task_submissions!left (
            id,
            status,
            bidder_id,
            file_url,
            submitted_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }

      return tasksData.map((task: any) => ({
        ...task,
        category: task.category as TaskCategory,
        bidders: task.task_bidders || [],
        submissions: task.task_submissions || []
      }));
    }
  });

  const activeTasks = availableTasks.filter(task => task.status !== 'inactive' && task.status !== 'expired');
  const inactiveTasks = availableTasks.filter(task => task.status === 'inactive' || task.status === 'expired');

  const handleSystemReset = async () => {
    if (window.confirm("Are you sure you want to reset the entire system? This action cannot be undone.")) {
      try {
        await resetSystemMutation.mutateAsync();
      } catch (error) {
        console.error('System reset error:', error);
      }
    }
  };

  const handleDeleteTasks = async (taskIds: string[]) => {
    if (window.confirm(`Are you sure you want to delete ${taskIds.length} task(s)? This action cannot be undone.`)) {
      try {
        await deleteMutation.mutateAsync(taskIds);
      } catch (error) {
        console.error('Delete tasks error:', error);
      }
    }
  };

  const handleToggleStatus = async (taskIds: string[], newStatus: 'active' | 'inactive') => {
    try {
      await toggleStatusMutation.mutateAsync({ taskIds, newStatus });
    } catch (error) {
      console.error('Toggle status error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar isAdmin>
          <div className="p-6">
            <h2 className="text-2xl font-bold">Loading...</h2>
          </div>
        </Sidebar>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Task Management</h2>
            <Button 
              variant="destructive"
              onClick={handleSystemReset}
              disabled={resetSystemMutation.isPending}
            >
              {resetSystemMutation.isPending ? "Resetting..." : "Reset System"}
            </Button>
          </div>
          
          <Tabs defaultValue="active" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active">Active Tasks ({activeTasks.length})</TabsTrigger>
              <TabsTrigger value="inactive">Inactive Tasks ({inactiveTasks.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <TaskList 
                tasks={activeTasks} 
                title="Active Tasks" 
                count={activeTasks.length}
                onDelete={handleDeleteTasks}
                onToggleStatus={handleToggleStatus}
              >
                <TaskUpload uploadMutation={uploadMutation} />
              </TaskList>
            </TabsContent>

            <TabsContent value="inactive">
              <TaskList 
                tasks={inactiveTasks} 
                title="Inactive Tasks" 
                count={inactiveTasks.length}
                onDelete={handleDeleteTasks}
                onToggleStatus={handleToggleStatus}
              />
            </TabsContent>
          </Tabs>
        </div>
      </Sidebar>
    </div>
  );
};

export default AdminTasks;