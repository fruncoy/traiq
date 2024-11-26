import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Task } from "@/types/task";

export const useTaskBidding = (tasks: Task[], userBids: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error("Task not found");

      const requiredBids = task.category === 'genai' ? 10 : 5;
      const MAX_BIDDERS = 10;

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No tasker logged in");

      // Validate bid requirements
      if (userBids < requiredBids) {
        throw new Error("insufficient_bids");
      }

      // Check if user has already bid on this task
      const { data: existingBids } = await supabase
        .from('task_bidders')
        .select('*')
        .eq('task_id', taskId)
        .eq('bidder_id', user.id);

      if (existingBids && existingBids.length > 0) {
        throw new Error("You have already bid on this task");
      }

      // Check if task has reached maximum bidders
      const { data: totalBidders } = await supabase
        .from('task_bidders')
        .select('*', { count: 'exact' })
        .eq('task_id', taskId);

      if (totalBidders && totalBidders.length >= MAX_BIDDERS) {
        throw new Error("This task has reached its maximum number of bidders");
      }

      // Start a transaction to update everything
      const { error: bidError } = await supabase
        .from('task_bidders')
        .insert({
          task_id: taskId,
          bidder_id: user.id
        });

      if (bidError) throw bidError;

      // Update task current bids
      const { error: taskError } = await supabase
        .from('tasks')
        .update({ current_bids: (task.current_bids || 0) + 1 })
        .eq('id', taskId);

      if (taskError) throw taskError;

      // Update user bids
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          bids: Math.max(0, userBids - requiredBids)
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      return task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['user-bids'] });
      toast.success("Successfully bid on task!");
    },
    onError: (error: Error) => {
      if (error.message === "insufficient_bids") {
        toast.error("You have insufficient bids. Please purchase more bids to continue.", {
          action: {
            label: "Buy Bids",
            onClick: () => window.location.href = "/tasker/buy-bids"
          }
        });
      } else {
        toast.error(error.message);
      }
    }
  });
};