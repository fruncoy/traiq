import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { TaskCategory } from "@/types/task";

export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  const resetSystemMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('manual_system_reset');
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("System has been reset successfully");
    },
    onError: (error) => {
      console.error('Reset error:', error);
      toast.error("Failed to reset system");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error: tasksError } = await supabase
        .from('tasks')
        .delete()
        .eq('status', 'archived');

      if (tasksError) throw tasksError;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tasks'] });
      toast.success("Successfully deleted archived tasks");
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error("Failed to delete tasks");
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
    uploadMutation
  };
};