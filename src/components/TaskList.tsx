import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import TaskCard from "./task/TaskCard";
import { Task } from "@/types/task";
import { LoadingSpinner } from "./ui/loading-spinner";
import { useState } from "react";
import { TaskListHeader } from "./task/TaskListHeader";
import { TaskListFooter } from "./task/TaskListFooter";
import { TaskBidDialog } from "./task/TaskBidDialog";
import { TaskListContent } from "./task/TaskListContent";
import { supabase } from "@/integrations/supabase/client";

const ITEMS_PER_PAGE = 5;

const TaskList = ({ limit, showViewMore = false, isAdmin = false }: { 
  limit?: number;
  showViewMore?: boolean;
  isAdmin?: boolean;
}) => {
  const queryClient = useQueryClient();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  const { data: userBids = 0 } = useQuery({
    queryKey: ['user-bids', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return 0;
      const { data: profile } = await supabase
        .from('profiles')
        .select('bids')
        .eq('id', session.user.id)
        .single();
      return profile?.bids || 0;
    },
    enabled: !!session?.user?.id
  });

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      let query = supabase
        .from('tasks')
        .select(`
          *,
          task_bidders(bidder_id),
          task_submissions(bidder_id, status)
        `);

      const { data: tasks, error } = await query;
      
      if (error) throw error;

      if (!isAdmin && session?.user?.id) {
        return tasks.filter((task: Task) => {
          const maxBids = task.category === 'genai' ? 10 : 5;
          const hasBid = task.task_bidders?.some(b => b.bidder_id === session.user.id);
          const hasSubmission = task.task_submissions?.some(s => 
            s.bidder_id === session.user.id
          );
          return task.current_bids < maxBids && 
                 !hasBid && 
                 !hasSubmission;
        });
      }

      return tasks;
    }
  });

  const bidMutation = useMutation({
    mutationFn: async (taskId: string) => {
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
      setShowConfirmDialog(false);
    },
    onError: (error: Error) => {
      setShowConfirmDialog(false);
      const selectedTask = tasks.find(t => t.id === selectedTaskId);
      
      toast.error(error.message, {
        position: "bottom-right",
        description: error.message === "insufficient_bids" 
          ? `This task requires ${selectedTask?.category === 'genai' ? '10' : '5'} bids. Please purchase more bids to continue.`
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

  const handleBidClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowConfirmDialog(true);
  };

  const confirmBid = () => {
    if (selectedTaskId) {
      bidMutation.mutate(selectedTaskId);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <TaskListHeader showViewMore={showViewMore} userBids={userBids} />
      <TaskListContent 
        tasks={tasks}
        limit={limit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
        handleBidClick={handleBidClick}
        isAdmin={isAdmin}
        userBids={userBids}
        bidMutation={bidMutation}
      />
      <TaskListFooter 
        showViewMore={showViewMore} 
        isAdmin={isAdmin} 
        tasksExist={tasks.length > 0} 
      />
      <TaskBidDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={confirmBid}
        isPending={bidMutation.isPending}
      />
    </div>
  );
};

export default TaskList;