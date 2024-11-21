import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import TaskCard from "./task/TaskCard";
import { handleTaskBid } from "./task/TaskBidLogic";
import { Task } from "@/types/task";
import { LoadingSpinner } from "./ui/loading-spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Button } from "./ui/button";

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

  const { data: tasks = [], refetch, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const storedTasks = localStorage.getItem('tasks');
      let tasks = storedTasks ? JSON.parse(storedTasks) : [];

      if (!isAdmin) {
        const userId = 'current-user-id';
        return tasks.filter((task: Task) => {
          const maxBids = task.category === 'genai' ? 10 : 5;
          return task.currentBids < maxBids && !task.bidders?.includes(userId);
        });
      }

      return tasks;
    }
  });

  const { data: userBids = 0 } = useQuery({
    queryKey: ['user-bids'],
    queryFn: async () => {
      const storedBids = localStorage.getItem('userBids');
      return storedBids ? parseInt(storedBids) : 0;
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
        className: "bg-green-50",
        description: `You have successfully bid on task ${task.code}`,
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
      
      if (error.message === "insufficient_bids") {
        toast.error("You don't have enough bids for this task", {
          description: `This task requires ${selectedTask?.category === 'genai' ? '10' : '5'} bids. Please purchase more bids to continue.`,
          action: {
            label: "Buy Bids",
            onClick: () => window.location.href = "/tasker/buy-bids"
          },
          duration: 5000,
          style: {
            background: 'white',
            border: '1px solid #fee2e2',
            borderRadius: '8px',
            padding: '12px',
            color: '#991b1b'
          }
        });
      } else if (error.message === "already_bid") {
        toast.error("You have already bid on this task", {
          description: "You cannot bid on the same task multiple times.",
          duration: 5000,
          style: {
            background: 'white',
            border: '1px solid #fee2e2',
            borderRadius: '8px',
            padding: '12px',
            color: '#991b1b'
          }
        });
      } else {
        toast.error("Failed to place bid", {
          description: "An unexpected error occurred. Please try again.",
          duration: 5000
        });
      }
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

  const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedTasks = limit ? tasks.slice(0, limit) : tasks.slice(startIndex, endIndex);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      {showViewMore && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Available Tasks</h2>
          <div className="text-sm text-gray-600">
            Available Bids: <span className="font-semibold">{userBids}</span>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {displayedTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tasks available at the moment.
          </div>
        ) : (
          displayedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onBid={(taskId) => handleBidClick(taskId)}
              isAdmin={isAdmin}
              userBids={userBids}
              isPending={bidMutation.isPending}
              hidePayouts={!isAdmin && (!task.submissions?.some(s => s.status === 'approved'))}
            />
          ))
        )}
      </div>

      {!limit && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {showViewMore && !isAdmin && tasks.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <Link to="/tasker/bidded-tasks" className="text-[#1E40AF] hover:underline flex items-center gap-2">
            View my bidded tasks <ArrowRight size={16} />
          </Link>
          <Link to="/tasker/buy-bids" className="text-[#1E40AF] hover:underline flex items-center gap-2">
            Buy more bids <ArrowRight size={16} />
          </Link>
        </div>
      )}

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Bid</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to place a bid on this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBid}>
              {bidMutation.isPending ? (
                <LoadingSpinner size="small" />
              ) : (
                "Confirm Bid"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TaskList;