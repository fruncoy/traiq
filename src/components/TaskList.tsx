import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import TaskCard from "./task/TaskCard";
import { handleTaskBid } from "./task/TaskBidLogic";
import { Task } from "@/types/task";
import { LoadingSpinner } from "./ui/loading-spinner";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { TaskListHeader } from "./task/TaskListHeader";
import { TaskListFooter } from "./task/TaskListFooter";
import { TaskBidDialog } from "./task/TaskBidDialog";
import { EmptyState } from "./task/EmptyState";
import { TaskListContent } from "./task/TaskListContent";

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

  const currentTasker = JSON.parse(localStorage.getItem('currentTasker') || '{}');

  const { data: tasks = [], refetch, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const storedTasks = localStorage.getItem('tasks');
      let tasks = storedTasks ? JSON.parse(storedTasks) : [];

      if (!isAdmin && currentTasker.id) {
        // Filter out tasks that:
        // 1. User has already bid on
        // 2. Has submissions from this user (new filter)
        // 3. Has rejected submissions
        // 4. Has approved submissions
        // 5. Has pending submissions
        return tasks.filter((task: Task) => {
          const maxBids = task.category === 'genai' ? 10 : 5;
          const hasSubmission = task.submissions?.some(s => 
            s.bidderId === currentTasker.id
          );
          const hasBid = task.bidders?.includes(currentTasker.id);
          return task.currentBids < maxBids && 
                 !hasBid && 
                 !hasSubmission;
        });
      }

      return tasks;
    },
    refetchInterval: 1000
  });

  const { data: userBids = 0 } = useQuery({
    queryKey: ['user-bids', currentTasker.id],
    queryFn: async () => {
      const taskers = JSON.parse(localStorage.getItem('taskers') || '[]');
      const tasker = taskers.find((t: any) => t.id === currentTasker.id);
      return tasker?.bids || 0;
    }
  });

  const bidMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error("Task not found");
      return handleTaskBid(task, userBids, tasks);
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
      refetch();
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
