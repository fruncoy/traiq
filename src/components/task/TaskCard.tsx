import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, DollarSign, CheckCircle, XCircle } from "lucide-react";
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

  const getStatusIcon = () => {
    const submission = task.submissions?.[0];
    if (!submission) return null;
    
    switch (submission.status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const formattedDeadline = formatDeadline(task.deadline);
  const requiredBids = task.category === 'genai' ? 10 : 5;
  const approvedSubmission = task.submissions?.find(s => s.status === 'approved');
  const taskPayout = task.category === 'genai' ? 700 : 300;

  // Get last 5 task submissions for admin view
  const taskerHistory = isAdmin ? JSON.parse(localStorage.getItem('taskSubmissions') || '[]')
    .filter((s: any) => s.bidderId === task.bidderId)
    .slice(0, 5) : [];

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-gray-900">{task.title}</h3>
              {getStatusIcon()}
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
            {(approvedSubmission || !hidePayouts) && (
              <div className="flex items-center gap-2 text-green-600">
                <DollarSign size={16} />
                <span className="font-medium">
                  {approvedSubmission ? 'Payout:' : 'Possible Payout:'}
                </span>
                <span>KES {taskPayout}</span>
              </div>
            )}
          </div>

          {/* Task History */}
          {isAdmin && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Task History:</span>
              <div className="flex gap-2">
                {taskerHistory.length > 0 ? (
                  taskerHistory.map((submission: any, index: number) => (
                    <div
                      key={index}
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        submission.status === 'approved' 
                          ? 'bg-green-500' 
                          : submission.status === 'rejected'
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                      }`}
                      title={`Task: ${submission.taskCode} - ${submission.status}`}
                    >
                      {submission.status === 'approved' ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : submission.status === 'rejected' ? (
                        <XCircle className="w-3 h-3 text-white" />
                      ) : (
                        <Clock className="w-3 h-3 text-white" />
                      )}
                    </div>
                  ))
                ) : (
                  Array(5).fill(null).map((_, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full bg-gray-200"
                      title="No previous tasks"
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
