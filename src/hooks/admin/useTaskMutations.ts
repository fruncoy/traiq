import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { TaskCategory } from "@/types/task";

export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  const resetSystemMutation = useMutation({
    mutationFn: async () => {
      console.log('Attempting system reset...');
      const { data, error } = await supabase.rpc('manual_system_reset');
      
      if (error) {
        console.error('Reset error:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("System has been reset successfully");
    },
    onError: (error) => {
      console.error('Reset error:', error);
      toast.error("Failed to reset system. Please try again.");
    }
  });

  const deleteMutation = useMutation({
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

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ taskIds, newStatus }: { taskIds: string[], newStatus: 'active' | 'inactive' }) => {
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

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const processedTasks = jsonData.map((row: any) => ({
              code: row.UniqueCode,
              title: row.Title,
              description: row.Description,
              category: (row.Category?.toLowerCase() === 'genai' ? 'genai' : 'creai') as TaskCategory,
              payout: row.Category?.toLowerCase() === 'genai' ? 500 : 250,
              tasker_payout: row.Category?.toLowerCase() === 'genai' ? 400 : 200,
              platform_fee: row.Category?.toLowerCase() === 'genai' ? 100 : 50,
              bids_needed: row.Category?.toLowerCase() === 'genai' ? 10 : 5,
              max_bidders: 10,
              current_bids: 0,
              deadline: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
              status: "pending"
            }));

            const { error: insertError } = await supabase
              .from('tasks')
              .insert(processedTasks);

            if (insertError) throw insertError;
            return true;
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsArrayBuffer(file);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tasks'] });
      toast.success("Tasks uploaded successfully");
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast.error("Failed to upload tasks");
    }
  });

  return {
    resetSystemMutation,
    deleteMutation,
    toggleStatusMutation,
    uploadMutation
  };
};