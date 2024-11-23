import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Task } from "@/types/task";

export const useTaskBidding = (tasks: Task[], userBids: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session?.user?.id) throw new Error("No user logged in");
      
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error("Task not found");

      const requiredBids = task.category === 'genai' ? 10 : 5;
      
      if (userBids < requiredBids) {
        throw new Error("insufficient_bids");
      }

      // Insert bid record
      const { error: bidError } = await supabase
        .from('task_bidders')
        .insert({
          task_id: taskId,
          bidder_id: session.user.id
        });

      if (bidError) throw bidError;

      // Update task current bids
      const { error: taskError } = await supabase
        .from('tasks')
        .update({ current_bids: (task.current_bids || 0) + 1 })
        .eq('id', taskId);

      if (taskError) throw taskError;

      // Update user's remaining bids
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ bids: userBids - requiredBids })
        .eq('id', session.user.id);

      if (profileError) throw profileError;

      return task;
    },
    onSuccess: (task) => {
      toast.success("Task bid placed successfully!", {
        position: "bottom-right",
        className: "bg-green-50",
        description: `You have successfully bid on task ${task.code}. The task is now in your bidded tasks.`,
        action: {
          label: "View Task",
          onClick: () => window.location.href = "/tasker/bidded-tasks"
        },
        duration: 5000,
        style: {
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '12px',
          color: '#1a202c'
        }
      });
      queryClient.invalidateQueries({ queryKey: ['user-bids'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['user-active-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: Error) => {
      toast.error(error.message, {
        position: "bottom-right",
        description: error.message === "insufficient_bids" 
          ? "You don't have enough bids for this task. Please purchase more bids to continue."
          : error.message,
        ...(error.message === "insufficient_bids" && {
          action: {
            label: "Buy Bids",
            onClick: () => window.location.href = "/tasker/buy-bids"
          }
        }),
        duration: 5000,
        style: {
          background: 'white',
          border: '1px solid #fee2e2',
          borderRadius: '8px',
          padding: '12px',
          color: '#991b1b'
        }
      });
    }
  });
};