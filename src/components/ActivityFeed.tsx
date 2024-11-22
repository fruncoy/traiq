import { Activity, ActivityType } from "@/types/activity";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle, AlertCircle, Ticket, CreditCard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case "submission":
      return <Clock className="h-4 w-4 text-blue-500" />;
    case "approval":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "rejection":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "pending":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case "bid":
      return <Clock className="h-4 w-4 text-purple-500" />;
    case "ticket":
      return <Ticket className="h-4 w-4 text-orange-500" />;
    case "bid_purchase":
      return <CreditCard className="h-4 w-4 text-green-500" />;
  }
};

const ActivityFeed = ({ isAdmin = false }) => {
  const { data: activities = [] } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const activities: Activity[] = [];
      
      // Get all tasks
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const taskers = JSON.parse(localStorage.getItem('taskers') || '[]');
      const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
      
      // Track bid activities
      tasks.forEach((task: any) => {
        if (task.bidders?.length) {
          task.bidders.forEach((bidderId: string) => {
            const tasker = taskers.find((t: any) => t.id === bidderId);
            activities.push({
              id: `bid-${task.id}-${bidderId}`,
              type: 'bid',
              message: `${tasker?.username || 'A tasker'} placed a bid on task ${task.code}`,
              timestamp: task.datePosted
            });
          });
        }

        // Track submission activities
        if (task.submissions?.length) {
          task.submissions.forEach((submission: any) => {
            const tasker = taskers.find((t: any) => t.id === submission.bidderId);
            activities.push({
              id: `submission-${task.id}-${submission.bidderId}`,
              type: submission.status === 'pending' ? 'submission' : 
                    submission.status === 'approved' ? 'approval' : 'rejection',
              message: `${tasker?.username || 'A tasker'} ${
                submission.status === 'pending' ? 'submitted' :
                submission.status === 'approved' ? 'got approved for' :
                'got rejected for'
              } task ${task.code}`,
              timestamp: submission.submittedAt
            });
          });
        }
      });

      // Track ticket submissions
      tickets.forEach((ticket: any) => {
        const tasker = taskers.find((t: any) => t.id === ticket.taskerId);
        activities.push({
          id: `ticket-${ticket.id}`,
          type: 'ticket',
          message: `${tasker?.username || 'A tasker'} submitted a support ticket: ${ticket.title}`,
          timestamp: ticket.createdAt
        });
      });

      // Sort activities by timestamp in descending order
      return activities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    },
    refetchInterval: 1000 // Refresh every second
  });

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {isAdmin ? "Recent Activity" : "Available Tasks"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-center text-gray-500">No recent activity</p>
            ) : (
              activities.map((activity: Activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 rounded-lg p-3 transition-colors hover:bg-gray-100"
                >
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;