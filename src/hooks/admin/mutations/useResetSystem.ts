import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useResetSystem = () => {
  const queryClient = useQueryClient();

  return useMutation({
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
};