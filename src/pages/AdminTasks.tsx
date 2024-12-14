import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TaskList } from "@/components/admin/task/TaskList";
import { TaskUpload } from "@/components/admin/task/TaskUpload";
import { useTaskMutations } from "@/hooks/admin/useTaskMutations";
import { toast } from "sonner";
import { Task } from "@/types/task";
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminTasks = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
  const { resetSystemMutation, deleteMutation, toggleStatusMutation, uploadMutation } = useTaskMutations();

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['admin-tasks'],
    queryFn: async () => {
      console.log('Fetching tasks...');
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select(`
            *,
            task_bidders (
              bidder_id,
              bid_date
            ),
            task_submissions (
              id,
              bidder_id,
              status,
              rejection_reason,
              submitted_at,
              file_name,
              file_url
            )
          `);

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        console.log('Tasks fetched:', data);
        return (data?.map(task => ({
          ...task,
          bidders: task.task_bidders || [],
          submissions: task.task_submissions || []
        })) || []) as Task[];
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        toast.error("Failed to fetch tasks. Please try again.");
        throw err;
      }
    },
    retry: 1
  });

  if (error) {
    console.error('Query error:', error);
    toast.error("Error loading tasks. Please refresh the page.");
  }

  if (isLoading) {
    return (
      <Sidebar isAdmin>
        <div className="container mx-auto py-6">
          <div>Loading tasks...</div>
        </div>
      </Sidebar>
    );
  }

  const activeTasks = tasks.filter(task => task.status === 'active' || task.status === 'pending');
  const inactiveTasks = tasks.filter(task => task.status === 'inactive');

  return (
    <Sidebar isAdmin>
      <div className="container mx-auto py-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Task Management</h1>
            <div className="space-x-4">
              <TaskUpload uploadMutation={uploadMutation.mutate} />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'active' | 'inactive')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Active Tasks ({activeTasks.length})</TabsTrigger>
              <TabsTrigger value="inactive">Inactive Tasks ({inactiveTasks.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              <TaskList 
                tasks={activeTasks}
                title="Active Tasks"
                count={activeTasks.length}
                onDelete={deleteMutation.mutate}
                onToggleStatus={(taskIds) => toggleStatusMutation.mutate({ taskIds, newStatus: 'inactive' })}
              />
            </TabsContent>
            
            <TabsContent value="inactive">
              <TaskList 
                tasks={inactiveTasks}
                title="Inactive Tasks"
                count={inactiveTasks.length}
                onDelete={deleteMutation.mutate}
                onToggleStatus={(taskIds) => toggleStatusMutation.mutate({ taskIds, newStatus: 'active' })}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Sidebar>
  );
};

export default AdminTasks;