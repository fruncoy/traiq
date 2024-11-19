import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";
import { Task } from "@/types/task";
import { toast } from "sonner";
import { format, isValid, parseISO } from "date-fns";

interface TaskCardProps {
  task: Task;
  onBid: (taskId: string) => void;
  isAdmin?: boolean;
  userBids: number;
  isPending: boolean;
  hidePayouts?: boolean;
}

const TaskCard = ({ task, onBid, isAdmin, userBids, isPending, hidePayouts = false }: TaskCardProps) => {
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

  const formatDeadline = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        console.error('Invalid date:', dateString);
        return 'Invalid date';
      }
      return format(date, "EEE, MMM do, h:mm a");
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const formattedDeadline = formatDeadline(task.deadline);
  const requiredBids = task.category === 'genai' ? 10 : 5;

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{task.title}</h3>
              <p className="text-sm text-gray-500 mt-1">Code: {task.code}</p>
            </div>
            {!isAdmin && task.currentBids < requiredBids && (
              <Button 
                className="bg-[#1E40AF] hover:bg-blue-700 text-white"
                onClick={handleBidClick}
                disabled={isPending || task.currentBids >= requiredBids}
              >
                {isPending ? "Bidding..." : "Bid Now"}
              </Button>
            )}
          </div>
          
          <p className="text-gray-600 text-sm">{task.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#1E40AF]" />
              <span>Deadline: {formattedDeadline}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-[#1E40AF]" />
              <div className="flex flex-col">
                <span>Total Bidders: {task.currentBids}/10</span>
                <span className="text-xs text-[#1E40AF]">
                  Required Bids: {requiredBids}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Category:</span> 
              <span className="capitalize">{task.category}</span>
            </div>
            {!hidePayouts && (
              <div className="flex items-center gap-2 text-green-600">
                <span className="font-medium">
                  {task.submissions?.some(s => s.status === 'approved') ? 'Payout:' : 'Possible Payout:'}
                </span>
                <span>KES {task.payout}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;