import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";

export interface Task {
  id: string;
  title: string;
  description: string;
  payout: number;
  workingTime: string;
  bidsNeeded: number;
  datePosted: string;
}

const TaskList = ({ limit, showViewMore = false, isAdmin = false }: { 
  limit?: number;
  showViewMore?: boolean;
  isAdmin?: boolean;
}) => {
  const { data: tasks = [], refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      // This would be replaced with actual API call
      return [] as Task[];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (taskId: string) => {
      // This would be replaced with actual API call
      toast.success("Task deleted successfully");
    },
    onSuccess: () => {
      refetch();
    }
  });

  const bidMutation = useMutation({
    mutationFn: async (taskId: string) => {
      // This would be replaced with actual API call
      toast.success("Bid placed successfully");
    }
  });

  const handleEditTask = (taskId: string) => {
    // This would open edit task modal/page
    toast.info("Edit task functionality to be implemented");
  };

  const handleDeleteTask = (taskId: string) => {
    deleteMutation.mutate(taskId);
  };

  const handleBidNow = (taskId: string) => {
    bidMutation.mutate(taskId);
  };

  const displayedTasks = limit ? tasks.slice(0, limit) : tasks;

  return (
    <div className="space-y-4">
      {showViewMore && (
        <h2 className="text-xl font-semibold mb-4">Available Tasks</h2>
      )}
      <div className="grid gap-4">
        {displayedTasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} />
                      <span>{task.workingTime}</span>
                    </div>
                    <p className="text-sm text-gray-600">Posted: {task.datePosted}</p>
                    <p className="text-sm text-gray-600">Bids needed: {task.bidsNeeded}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-primary">KES {task.payout}</span>
                    {!isAdmin ? (
                      <Button 
                        className="text-white"
                        onClick={() => handleBidNow(task.id)}
                      >
                        Bid Now
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditTask(task.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showViewMore && !isAdmin && tasks.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <Link to="/tasker/tasks" className="text-primary hover:underline flex items-center gap-2">
            View all tasks <ArrowRight size={16} />
          </Link>
          <Link to="/tasker/buy-bids" className="text-primary hover:underline flex items-center gap-2">
            Buy more bids <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default TaskList;