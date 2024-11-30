import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, DollarSign } from "lucide-react";
import { Task } from "@/types/task";
import { toast } from "sonner";
import { format, isValid, parseISO, differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface TaskCardProps {
  task: Task;
  onBid: (taskId: string) => void;
  isAdmin?: boolean;
  userBids: number;
  isPending: boolean;
  hidePayouts?: boolean;
}

const TaskCard = ({ task, onBid, isAdmin, userBids, isPending, hidePayouts }: TaskCardProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const updateCountdown = () => {
      if (!task.deadline) return;
      
      const now = new Date();
      const deadline = parseISO(task.deadline);
      
      if (!isValid(deadline)) return;
      
      const days = differenceInDays(deadline, now);
      const hours = differenceInHours(deadline, now) % 24;
      const minutes = differenceInMinutes(deadline, now) % 60;
      
      if (days < 0 || (days === 0 && hours < 0) || (days === 0 && hours === 0 && minutes < 0)) {
        setTimeLeft("Expired");
        return;
      }
      
      let countdown = "";
      if (days > 0) countdown += `${days}d `;
      if (hours > 0) countdown += `${hours}h `;
      countdown += `${minutes}m`;
      
      setTimeLeft(countdown);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [task.deadline]);

  const handleBidClick = () => {
    if (!task?.title) return;
    
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

  const handleSubmitWork = () => {
    navigate(`/tasker/submit/${task.id}`);
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
  const formattedDeadline = formatDeadline(task.deadline || '');
  
  const taskers = JSON.parse(localStorage.getItem('taskers') || '[]');
  const actualBidders = task.bidders?.filter(bidderId => 
    taskers.some((t: any) => t.id === bidderId)
  ) || [];

  if (!task?.title) return null;

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
            {!isAdmin && actualBidders.length < MAX_BIDDERS ? (
              <Button 
                className="bg-[#1E40AF] hover:bg-blue-700 text-white"
                onClick={handleBidClick}
                disabled={isPending || actualBidders.length >= MAX_BIDDERS}
              >
                {isPending ? "Bidding..." : "Bid Now"}
              </Button>
            ) : (
              <Button
                className="bg-[#1E40AF] hover:bg-blue-700 text-white"
                onClick={handleSubmitWork}
              >
                Submit Work
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-gray-500" />
              <div className="flex flex-col">
                <span className="text-gray-700">Time Left:</span>
                <span className={`font-medium ${timeLeft === "Expired" ? "text-red-600" : "text-blue-600"}`}>
                  {timeLeft}
                </span>
                <span className="text-xs text-gray-500">Deadline: {formattedDeadline}</span>
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

            {!hidePayouts && (
              <div className="flex items-center gap-2">
                <DollarSign size={20} className="text-green-500" />
                <span className="text-green-600 font-medium">
                  Payout: KES {taskerPayout}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
