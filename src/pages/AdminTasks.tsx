import Sidebar from "../components/Sidebar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Task, TaskCategory } from "@/types/task";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskList } from "@/components/admin/task/TaskList";
import { TaskUpload } from "@/components/admin/task/TaskUpload";
import { useTaskMutations } from "@/hooks/admin/useTaskMutations";

const AdminTasks = () => {
  const { resetSystemMutation, deleteMutation, uploadMutation } = useTaskMutations();

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

      if (error) throw error;

      return tasksData.map((task: any) => ({
        ...task,
        category: task.category as TaskCategory,
        bidders: task.task_bidders || [],
        submissions: task.task_submissions || []
      }));
    },
    refetchInterval: 5000
  });

  const activeTasks = availableTasks.filter(task => task.status !== 'archived');
  const archivedTasks = availableTasks.filter(task => task.status === 'archived');

  const handleSystemReset = () => {
    if (window.confirm("Are you sure you want to reset the entire system? This action cannot be undone.")) {
      resetSystemMutation.mutate();
    }
  };

  const handleDeleteArchived = () => {
    if (window.confirm("Are you sure you want to delete all archived tasks? This action cannot be undone.")) {
      deleteMutation.mutate();
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
              Reset System
            </Button>
          </div>
          
          <Tabs defaultValue="active" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active">Active Tasks</TabsTrigger>
              <TabsTrigger value="archived">Archived Tasks</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <TaskList 
                tasks={activeTasks} 
                title="Active Tasks" 
                count={activeTasks.length}
              >
                <TaskUpload uploadMutation={uploadMutation} />
              </TaskList>
            </TabsContent>

            <TabsContent value="archived">
              <TaskList 
                tasks={archivedTasks} 
                title="Archived Tasks" 
                count={archivedTasks.length}
              >
                <Button 
                  variant="destructive"
                  onClick={handleDeleteArchived}
                  disabled={deleteMutation.isPending}
                >
                  Delete Archived Tasks
                </Button>
              </TaskList>
            </TabsContent>
          </Tabs>
        </div>
      </Sidebar>
    </div>
  );
};

export default AdminTasks;