import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useTaskDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskIds: string[]) => {
      console.log('Deleting tasks:', taskIds);
      
      // First delete related records in the correct order
      const { error: submissionsError } = await supabase
        .from('task_submissions')
        .delete()
        .in('task_id', taskIds);

      if (submissionsError) {
        console.error('Delete submissions error:', submissionsError);
        throw submissionsError;
      }

      const { error: biddersError } = await supabase
        .from('task_bidders')
        .delete()
        .in('task_id', taskIds);

      if (biddersError) {
        console.error('Delete bidders error:', biddersError);
        throw biddersError;
      }

      // Finally delete the tasks
      const { error: tasksError } = await supabase
        .from('tasks')
        .delete()
        .in('id', taskIds);

      if (tasksError) {
        console.error('Delete tasks error:', tasksError);
        throw tasksError;
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tasks'] });
      toast.success("Successfully deleted tasks");
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error("Failed to delete tasks. Please try again.");
    }
  });
};