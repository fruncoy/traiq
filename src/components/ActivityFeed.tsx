import { Activity, ActivityType } from "@/types/activity";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle, AlertCircle, Ticket, CreditCard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

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
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['activities', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      const { data: submissions, error: submissionsError } = await supabase
        .from('task_submissions')
        .select(`
          *,
          tasks (code),
          profiles (username)
        `)
        .order('submitted_at', { ascending: false });

      if (submissionsError) throw submissionsError;

      const { data: bids, error: bidsError } = await supabase
        .from('task_bidders')
        .select(`
          *,
          tasks (code),
          profiles (username)
        `)
        .order('bid_date', { ascending: false });

      if (bidsError) throw bidsError;

      const activities: Activity[] = [];

      // Track bid activities
      bids?.forEach((bid) => {
        activities.push({
          id: `bid-${bid.task_id}-${bid.bidder_id}`,
          type: 'bid',
          message: `${bid.profiles?.username || 'A tasker'} placed a bid on task ${bid.tasks?.code}`,
          timestamp: bid.bid_date
        });
      });

      // Track submission activities
      submissions?.forEach((submission) => {
        activities.push({
          id: `submission-${submission.task_id}-${submission.bidder_id}`,
          type: submission.status === 'pending' ? 'submission' : 
                submission.status === 'approved' ? 'approval' : 'rejection',
          message: `${submission.profiles?.username || 'A tasker'} ${
            submission.status === 'pending' ? 'submitted' :
            submission.status === 'approved' ? 'got approved for' :
            'got rejected for'
          } task ${submission.tasks?.code}`,
          timestamp: submission.submitted_at
        });
      });

      // Sort activities by timestamp in descending order
      return activities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    },
    refetchInterval: 5000 // Refresh every 5 seconds
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