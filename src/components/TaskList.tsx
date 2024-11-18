import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import TaskCard from "./task/TaskCard";
import { Task } from "@/types/task";
import { generateTaskDescription, calculateBidsRequired, calculatePayout } from "@/utils/initializeData"; // Assume this import exists for the new helper functions
import { TaskCategory } from "@/types/task"; // Updated import for TaskCategory

const MULTIPLIER = 40; // Fixed multiplier

const generateNewTask = (category?: TaskCategory): Task => {
  const popularityData = JSON.parse(localStorage.getItem('categoryPopularity') || '{}');
  const mostPopularCategory = Object.entries(popularityData)
    .sort(([, a], [, b]) => (b as number) - (a as number))[0][0] as TaskCategory;

  const payout = Math.floor(Math.random() * (1000 - 300) + 300);
  const bidsRequired = calculateBidsRequired(payout);

  return {
    id: Date.now().toString(),
    title: `${mostPopularCategory.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Task`,
    description: generateTaskDescription(mostPopularCategory),
    category: mostPopularCategory,
    payout,
    workingTime: payout > 500 ? "2-3 hours" : "1-2 hours",
    bidsNeeded: 10, // System-wide bid requirement
    currentBids: 0,
    datePosted: new Date().toISOString().split('T')[0],
    bidders: [],
    selectedTaskers: []
  };
};

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
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];

      // Ensure minimum 3 tasks
      if (tasks.length < 3) {
        const newTasks = Array(3 - tasks.length).fill(null).map(() => 
          generateNewTask()
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
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error("Task not found");

      const currentBids = parseInt(localStorage.getItem('userBids') || '0');
      if (currentBids <= 0) throw new Error("insufficient_bids");

      // Check if user has already bid on this task
      if (task.bidders?.includes('current-user-id')) {
        throw new Error("already_bid");
      }

      // Update category popularity
      const popularityData = JSON.parse(localStorage.getItem('categoryPopularity') || '{}');
      popularityData[task.category] = (popularityData[task.category] || 0) + 1;
      localStorage.setItem('categoryPopularity', JSON.stringify(popularityData));

      // Update user's bids
      const bidsRequired = calculateBidsRequired(task.payout);
      if (currentBids < bidsRequired) throw new Error("insufficient_bids");

      localStorage.setItem('userBids', (currentBids - bidsRequired).toString());

      // Update task's current bids and bidders
      task.currentBids += 1;
      task.bidders = [...(task.bidders || []), 'current-user-id'];

      const updatedTasks = tasks.map(t => t.id === taskId ? task : t);

      // If task reaches bid limit, move to active and generate new task
      if (task.currentBids >= task.bidsNeeded) {
        task.status = "active";
        // Select random 5 taskers for payout
        task.selectedTaskers = task.bidders
          ?.sort(() => Math.random() - 0.5)
          .slice(0, 5);

        const activeTasks = JSON.parse(localStorage.getItem('activeTasks') || '[]');
        activeTasks.push(task);
        localStorage.setItem('activeTasks', JSON.stringify(activeTasks));

        // Generate new task based on popularity
        const newTask = generateNewTask();
        updatedTasks.push(newTask);

        // Remove completed task from available tasks
        const remainingTasks = updatedTasks.filter(t => t.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(remainingTasks));

        // Add activity
        const activities = JSON.parse(localStorage.getItem('activities') || '[]');
        activities.unshift({
          id: Date.now().toString(),
          type: "approval",
          message: `Task "${task.title}" is now active`,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('activities', JSON.stringify(activities));
      } else {
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      }

      return task;
    },
    onSuccess: (task) => {
      if (task.currentBids >= task.bidsNeeded) {
        toast.success("Task is now active!", {
          description: "The task has received all required bids and is ready to start."
        });
      } else {
        toast.success("Bid placed successfully!", {
          description: `${task.bidsNeeded - task.currentBids} bids remaining for this task.`
        });
      }
      queryClient.invalidateQueries({ queryKey: ['user-bids'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
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
      } else {
        toast.error("Failed to place bid", {
          description: "Please try again later."
        });
      }
    }
  });

  // Filter out tasks that have reached their bid limit
  const availableTasks = tasks.filter(task => !task.status || task.status === "pending");
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
      <div className="grid gap-4">
        {displayedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onBid={(taskId) => bidMutation.mutate(taskId)}
            isAdmin={isAdmin}
            userBids={userBids}
            isPending={bidMutation.isPending}
          />
        ))}
      </div>

      {showViewMore && !isAdmin && tasks.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <Link to="/tasker/tasks" className="text-[#1E40AF] hover:underline flex items-center gap-2">
            View all tasks <ArrowRight size={16} />
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
