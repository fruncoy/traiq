import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ToggleStatusParams {
  taskIds: string[];
  newStatus: 'active' | 'inactive';
}

export const useTaskStatusToggle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskIds, newStatus }: ToggleStatusParams) => {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .in('id', taskIds);

      if (error) throw error;
      return true;
    },
    onSuccess: (_, { newStatus }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-tasks'] });
      toast.success(`Successfully ${newStatus === 'active' ? 'activated' : 'deactivated'} tasks`);
    },
    onError: (error) => {
      console.error('Status update error:', error);
      toast.error("Failed to update task status");
    }
  });
};