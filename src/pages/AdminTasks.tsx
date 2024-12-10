import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TaskTable } from "@/components/admin/task/TaskTable";
import { TaskList } from "@/components/admin/task/TaskList";
import { TaskUpload } from "@/components/admin/task/TaskUpload";
import { useTaskMutations } from "@/hooks/admin/useTaskMutations";
import { toast } from "sonner";
import { Task } from "@/types/task";
import Sidebar from "@/components/Sidebar";

const AdminTasks = () => {
  const { resetSystemMutation, deleteMutation, toggleStatusMutation, uploadMutation } = useTaskMutations();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['admin-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          id,
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
          status,
          date_posted,
          created_at,
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
        toast.error("Failed to fetch tasks");
        throw error;
      }

      return (data?.map(task => ({
        ...task,
        bidders: task.task_bidders || [],
        submissions: task.task_submissions || []
      })) || []) as Task[];
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

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

          <TaskList 
            tasks={tasks} 
            title="All Tasks"
            count={tasks.length}
            onDelete={deleteMutation.mutate}
            onToggleStatus={(taskIds, newStatus) => toggleStatusMutation.mutate({ taskIds, newStatus })}
          />
          
          <TaskTable 
            tasks={tasks}
            selectedTasks={[]}
            onSelectAll={() => {}}
            onSelectTask={() => {}}
          />
        </div>
      </div>
    </Sidebar>
  );
};

export default AdminTasks;