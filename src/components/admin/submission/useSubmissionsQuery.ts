import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TaskSubmission } from "@/types/task";

export const useSubmissionsQuery = (taskId: string) => {
  return useQuery({
    queryKey: ['task-submissions', taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('task_submissions')
        .select(`
          *,
          profiles (
            username,
            email
          )
        `)
        .eq('task_id', taskId);

      if (error) throw error;
      return data as TaskSubmission[];
    }
  });
};