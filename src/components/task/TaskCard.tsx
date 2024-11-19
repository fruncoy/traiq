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
  const showPayout = isAdmin || (task.submissions?.some(s => s.status === 'approved'));

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <span className="text-sm text-gray-600">Code: {task.code}</span>
            </div>
            <p className="text-sm text-gray-600">{task.description}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} />
                <span>Deadline: {formattedDeadline}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users size={16} />
                <span>Bidders: {task.currentBids}/10</span>
              </div>
              <p className="text-sm text-gray-600">
                Category: {task.category}
              </p>
              {!hidePayouts && (
                <p className="text-sm text-green-600">
                  {showPayout ? 'Payout' : 'Possible Payout'}: KES {task.payout}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
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