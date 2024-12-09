import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskCategory } from "@/types/task";
import { LoadingSpinner } from "./ui/loading-spinner";
import { TaskListHeader } from "./task/TaskListHeader";
import { TaskListFooter } from "./task/TaskListFooter";
import { TaskBidDialog } from "./task/TaskBidDialog";
import { TaskListContent } from "./task/TaskListContent";
import { useUserBids } from "@/hooks/useUserBids";
import { useTaskBidding } from "@/hooks/useTaskBidding";

const ITEMS_PER_PAGE = 5;

const TaskList = ({ 
  limit, 
  showViewMore = false, 
  isAdmin = false 
}: { 
  limit?: number;
  showViewMore?: boolean;
  isAdmin?: boolean;
}) => {
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

  const { data: userBids = 0 } = useUserBids(session?.user?.id);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', session?.user?.id, isAdmin],
    queryFn: async () => {
      const query = supabase
        .from('tasks')
        .select(`
          *,
          task_bidders (
            bidder_id,
            bid_date
          ),
          task_submissions (
            bidder_id,
            status
          )
        `)
        .eq('status', 'pending');

      const { data, error } = await query;

      if (error) throw error;

      const transformedTasks = data.map((task: any) => ({
        ...task,
        category: task.category as TaskCategory,
        bidders: task.task_bidders?.map((b: any) => ({
          bidder_id: b.bidder_id,
          bid_date: b.bid_date
        })) || [],
        submissions: task.task_submissions || []
      }));

      if (!isAdmin && session?.user?.id) {
        return transformedTasks.filter((task: Task) => {
          const hasBid = task.bidders.some(b => b.bidder_id === session.user.id);
          const hasSubmission = task.submissions.some(s => 
            s.bidder_id === session.user.id && s.status !== 'rejected'
          );
          const maxBidsReached = task.bidders.length >= (task.category === 'genai' ? 10 : 5);
          
          return !hasBid && !hasSubmission && !maxBidsReached;
        });
      }

      return transformedTasks;
    },
    refetchInterval: 5000
  });

  const bidMutation = useTaskBidding(tasks, userBids);

  const handleBidClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowConfirmDialog(true);
  };

  const confirmBid = async () => {
    if (selectedTaskId) {
      await bidMutation.mutateAsync(selectedTaskId);
      setShowConfirmDialog(false);
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