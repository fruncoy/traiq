import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import TaskCard from "./task/TaskCard";
import { handleTaskBid } from "./task/TaskBidLogic";
import { Task } from "@/types/task";

const TaskList = ({ limit, showViewMore = false, isAdmin = false }: { 
  limit?: number;
  showViewMore?: boolean;
  isAdmin?: boolean;
}) => {
  const queryClient = useQueryClient();

  const { data: tasks = [], refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const storedTasks = localStorage.getItem('tasks');
      let tasks = storedTasks ? JSON.parse(storedTasks) : [];

      // For admin, show all tasks. For taskers, only show tasks with less than 10 bids
      // and tasks they haven't bid on yet
      if (!isAdmin) {
        const userId = 'current-user-id';
        return tasks.filter((task: Task) => 
          task.currentBids < 10 && 
          !task.bidders?.includes(userId)
        );
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
    },
    onError: (error: Error) => {
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

  const displayedTasks = limit ? tasks.slice(0, limit) : tasks;

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
              onBid={(taskId) => bidMutation.mutate(taskId)}
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
    </div>
  );
};

export default TaskList;