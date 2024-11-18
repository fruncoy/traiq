import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";
import { Task } from "@/types/task";
import { toast } from "sonner";

interface TaskCardProps {
  task: Task;
  onBid: (taskId: string) => void;
  isAdmin?: boolean;
  userBids: number;
  isPending: boolean;
}

const TaskCard = ({ task, onBid, isAdmin, userBids, isPending }: TaskCardProps) => {
  const handleBidClick = () => {
    if (userBids <= 0) {
      toast.error("You have insufficient bids. Please purchase more bids to continue.", {
        action: {
          label: "Buy Bids",
          onClick: () => window.location.href = "/tasker/buy-bids"
        }
      });
      return;
    }
    onBid(task.id);
  };

  return (
    <Card>
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
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users size={16} />
                <span>Total Bidders: {task.currentBids}</span>
              </div>
              {!isAdmin && (
                <p className="text-sm text-blue-600">
                  Requires {task.bidsNeeded} bids
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-[#1E40AF]">KES {task.payout}</span>
              {!isAdmin && (
                <Button 
                  className="bg-white text-[#1E40AF] border border-[#1E40AF] hover:bg-[#1E40AF] hover:text-white"
                  onClick={handleBidClick}
                  disabled={isPending}
                >
                  {isPending ? "Bidding..." : "Bid Now"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;