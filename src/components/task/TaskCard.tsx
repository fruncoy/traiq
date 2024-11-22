import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, DollarSign } from "lucide-react";
import { Task } from "@/types/task";
import { toast } from "sonner";
import { format, isValid, parseISO } from "date-fns";

interface TaskCardProps {
  task: Task;
  onBid: (taskId: string) => void;
  isAdmin?: boolean;
  userBids: number;
  isPending: boolean;
}

const TaskCard = ({ task, onBid, isAdmin, userBids, isPending }: TaskCardProps) => {
  const handleBidClick = () => {
    if (!task?.title) return; // Prevent bidding on invalid tasks
    
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
      if (!isValid(date)) return 'Invalid date';
      return format(date, "EEE, MMM do, h:mm a");
    } catch (error) {
      return 'Invalid date';
    }
  };

  const MAX_BIDDERS = 10;
  const requiredBids = task.category === 'genai' ? 10 : 5;
  const taskerPayout = task.category === 'genai' ? 700 : 300;
  const formattedDeadline = formatDeadline(task.deadline);
  
  const taskers = JSON.parse(localStorage.getItem('taskers') || '[]');
  const actualBidders = task.bidders?.filter(bidderId => 
    taskers.some((t: any) => t.id === bidderId)
  ) || [];

  if (!task?.title) return null; // Don't render invalid tasks

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                {task.title}
                {isAdmin && <span className="text-green-500">✓</span>}
              </h3>
              <p className="text-gray-600 mt-2">{task.description}</p>
            </div>
            {!isAdmin && actualBidders.length < MAX_BIDDERS && (
              <Button 
                className="bg-[#1E40AF] hover:bg-blue-700 text-white"
                onClick={handleBidClick}
                disabled={isPending || actualBidders.length >= MAX_BIDDERS}
              >
                {isPending ? "Bidding..." : "Bid Now"}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-gray-500" />
              <div className="flex flex-col">
                <span className="text-gray-700">Deadline:</span>
                <span className="text-gray-600">{formattedDeadline}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Users size={20} className="text-gray-500" />
              <div className="flex flex-col">
                <span className="text-gray-700">Total Bidders: {actualBidders.length}/{MAX_BIDDERS}</span>
                <span className="text-blue-600">Required Bids: {requiredBids}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-700">Category:</span>
              <span className="capitalize text-gray-600">{task.category}</span>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign size={20} className="text-green-500" />
              <span className="text-green-600 font-medium">
                Payout: KES {taskerPayout}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;