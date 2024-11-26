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
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          task_bidders (
            bidder_id
          ),
          task_submissions (
            bidder_id,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our Task interface
      const transformedTasks = data.map((task: any) => ({
        ...task,
        category: task.category as TaskCategory,
        bidders: task.task_bidders?.map((b: any) => b.bidder_id) || [],
        submissions: task.task_submissions || []
      }));

      if (!isAdmin && session?.user?.id) {
        return transformedTasks.filter((task: Task) => {
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

      return transformedTasks;
    },
    refetchInterval: 5000 // Refresh every 5 seconds to see new tasks
  });

  const bidMutation = useTaskBidding(tasks, userBids);

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