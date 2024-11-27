import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TaskerSuspendButtonProps {
  taskerId: string;
  isSuspended: boolean;
}

export const TaskerSuspendButton = ({ taskerId, isSuspended }: TaskerSuspendButtonProps) => {
  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();

  const suspendMutation = useMutation({
    mutationFn: async () => {
      setIsPending(true);
      const { error } = await supabase
        .from('profiles')
        .update({ 
          suspended_at: isSuspended ? null : new Date().toISOString() 
        })
        .eq('id', taskerId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskers'] });
      toast.success(`Tasker ${isSuspended ? 'unsuspended' : 'suspended'} successfully`);
    },
    onError: (error) => {
      console.error('Suspension error:', error);
      toast.error('Failed to update tasker suspension status');
    },
    onSettled: () => {
      setIsPending(false);
    }
  });

  return (
    <Button
      variant={isSuspended ? "default" : "destructive"}
      size="sm"
      onClick={() => suspendMutation.mutate()}
      disabled={isPending}
    >
      {isPending ? "Processing..." : (isSuspended ? "Unsuspend" : "Suspend")}
    </Button>
  );
};