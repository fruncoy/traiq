import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import TaskCard from "./task/TaskCard";
import { handleTaskBid, generateNewTask } from "./task/TaskBidLogic";
import { useState } from "react";
import TaskFilters from "./task/TaskFilters";
import { Task } from "@/types/task";

const TaskList = ({ limit, showViewMore = false, isAdmin = false }: { 
  limit?: number;
  showViewMore?: boolean;
  isAdmin?: boolean;
}) => {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'short_essay' | 'long_essay' | 'item_listing' | 'voice_recording'>('all');

  const { data: tasks = [], refetch } = useQuery({
    queryKey: ['tasks', selectedCategory],
    queryFn: async () => {
      console.log("Fetching tasks for category:", selectedCategory);
      const storedTasks = localStorage.getItem('tasks');
      let tasks = storedTasks ? JSON.parse(storedTasks) : [];

      if (selectedCategory !== 'all') {
        tasks = tasks.filter((task: Task) => task.category === selectedCategory);
      }

      if (tasks.length < 3) {
        const newTasks = Array(3 - tasks.length).fill(null).map(() => 
          generateNewTask(selectedCategory === 'all' ? undefined : selectedCategory)
        );
        const updatedTasks = [...tasks, ...newTasks];
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        return updatedTasks;
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
      console.log("Bidding on task:", taskId);
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error("Task not found");
      return handleTaskBid(task, userBids, tasks);
    },
    onSuccess: (task) => {
      toast.success("Task assigned successfully!", {
        description: "You can now start working on this task."
      });
      
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
          description: "Please purchase more bids to continue.",
          action: {
            label: "Buy Bids",
            onClick: () => window.location.href = "/tasker/buy-bids"
          }
        });
      } else if (error.message === "already_bid") {
        toast.error("Already bid", {
          description: "You have already placed a bid on this task."
        });
      } else {
        toast.error("Failed to place bid", {
          description: "Please try again later."
        });
      }
    }
  });

  // Filter out tasks that have reached their bid limit
  const availableTasks = tasks.filter(task => 
    task.currentBids < task.bidsNeeded && 
    (!task.status || task.status === "pending")
  );
  
  const displayedTasks = limit ? availableTasks.slice(0, limit) : availableTasks;

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

      <div className="relative z-10 mb-8">
        <TaskFilters 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      <div className="grid gap-4">
        {displayedTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            There are no available tasks at the moment. Please check back later.
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
              hidePayouts={!isAdmin}
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