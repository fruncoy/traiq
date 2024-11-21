import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import TaskCard from "./task/TaskCard";
import { handleTaskBid } from "./task/TaskBidLogic";
import { Task } from "@/types/task";
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

const TaskList = ({ limit, showViewMore = false, isAdmin = false }: { 
  limit?: number;
  showViewMore?: boolean;
  isAdmin?: boolean;
}) => {
  const queryClient = useQueryClient();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { data: tasks = [], refetch, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const storedTasks = localStorage.getItem('tasks');
      let tasks = storedTasks ? JSON.parse(storedTasks) : [];
      console.log("Retrieved tasks:", tasks);

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
      toast.success("Task assigned successfully!");
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
      if (error.message === "insufficient_bids") {
        toast.error("Insufficient bids", {
          action: {
            label: "Buy Bids",
            onClick: () => window.location.href = "/tasker/buy-bids"
          }
        });
      } else {
        toast.error("Failed to place bid");
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

  const displayedTasks = limit ? tasks.slice(0, limit) : tasks;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
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
                <Loader2 className="h-4 w-4 animate-spin" />
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