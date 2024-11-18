import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import TaskCard from "./task/TaskCard";
import { Task } from "@/types/task";

const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Content Writing Task",
    description: "Write a 1000-word article about renewable energy",
    payout: 500,
    workingTime: "2 hours",
    bidsNeeded: 5,
    currentBids: 0,
    datePosted: new Date().toISOString().split('T')[0]
  },
  {
    id: "2",
    title: "Data Entry Project",
    description: "Enter customer information into database",
    payout: 300,
    workingTime: "1 hour",
    bidsNeeded: 3,
    currentBids: 0,
    datePosted: new Date().toISOString().split('T')[0]
  }
];

const TaskList = ({ limit, showViewMore = false, isAdmin = false }: { 
  limit?: number;
  showViewMore?: boolean;
  isAdmin?: boolean;
}) => {
  const queryClient = useQueryClient();

  const { data: tasks = sampleTasks, refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const storedTasks = localStorage.getItem('tasks');
      return storedTasks ? JSON.parse(storedTasks) : sampleTasks;
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
      
      // Update user's bids
      localStorage.setItem('userBids', (currentBids - 1).toString());
      
      // Update task's current bids and store in user's active tasks
      task.currentBids += 1;
      const updatedTasks = tasks.map(t => t.id === taskId ? task : t);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      
      // Add to user's earnings potential
      const currentEarnings = parseFloat(localStorage.getItem('potentialEarnings') || '0');
      localStorage.setItem('potentialEarnings', (currentEarnings + task.payout).toString());
      
      // Add to user's bids history
      const userBids = JSON.parse(localStorage.getItem('userBidHistory') || '[]');
      userBids.push({
        id: Date.now().toString(),
        taskId: task.id,
        taskTitle: task.title,
        bidAmount: task.payout,
        status: task.currentBids >= task.bidsNeeded ? "active" : "pending",
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('userBidHistory', JSON.stringify(userBids));
      
      // If task reaches bid limit, mark as active
      if (task.currentBids >= task.bidsNeeded) {
        task.status = "active";
        const activeTasks = JSON.parse(localStorage.getItem('activeTasks') || '[]');
        activeTasks.push(task);
        localStorage.setItem('activeTasks', JSON.stringify(activeTasks));
        
        // Remove task from available tasks
        const remainingTasks = tasks.filter(t => t.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(remainingTasks));
      }
      
      return task;
    },
    onSuccess: (task) => {
      if (task.currentBids >= task.bidsNeeded) {
        toast.success("Congratulations! You've been assigned the task.", {
          description: "You can now submit your work in the Submit Task page."
        });
      } else {
        toast.success("Bid placed successfully!");
      }
      queryClient.invalidateQueries({ queryKey: ['user-bids'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      refetch();
    },
    onError: (error: Error) => {
      if (error.message === "insufficient_bids") {
        toast.error("Insufficient bids. Please purchase more bids to continue.", {
          action: {
            label: "Buy Bids",
            onClick: () => window.location.href = "/tasker/buy-bids"
          }
        });
      } else {
        toast.error("Failed to place bid. Please try again.");
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