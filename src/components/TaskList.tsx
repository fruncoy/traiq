import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export interface Task {
  id: string;
  title: string;
  description: string;
  payout: number;
  workingTime: string;
  bidsNeeded: number;
  currentBids: number;
  datePosted: string;
}

const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Content Writing Task",
    description: "Write a 1000-word article about renewable energy",
    payout: 500,
    workingTime: "2 hours",
    bidsNeeded: 10,
    currentBids: 0,
    datePosted: new Date().toISOString().split('T')[0]
  },
  {
    id: "2",
    title: "Data Entry Project",
    description: "Enter customer information into database",
    payout: 300,
    workingTime: "1 hour",
    bidsNeeded: 10,
    currentBids: 0,
    datePosted: new Date().toISOString().split('T')[0]
  },
  {
    id: "3",
    title: "Translation Work",
    description: "Translate a document from English to Spanish",
    payout: 600,
    workingTime: "3 hours",
    bidsNeeded: 10,
    currentBids: 0,
    datePosted: new Date().toISOString().split('T')[0]
  }
];

const TaskList = ({ limit, showViewMore = false, isAdmin = false }: { 
  limit?: number;
  showViewMore?: boolean;
  isAdmin?: boolean;
}) => {
  const { data: tasks = sampleTasks, refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      return sampleTasks.filter(task => task.currentBids < task.bidsNeeded);
    }
  });

  const bidMutation = useMutation({
    mutationFn: async (taskId: string) => {
      // This would be replaced with actual API call
      toast.success("Bid request sent to admin");
    }
  });

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
                    <p className="text-sm text-gray-600">Bids: {task.currentBids}/{task.bidsNeeded}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-[#1E40AF]">KES {task.payout}</span>
                    {!isAdmin && (
                      <Button 
                        className="bg-white text-[#1E40AF] border border-[#1E40AF] hover:bg-[#1E40AF] hover:text-white"
                        onClick={() => handleBidNow(task.id)}
                      >
                        Bid Now
                      </Button>
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
