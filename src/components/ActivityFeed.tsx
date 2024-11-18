import { Activity, ActivityType } from "@/types/activity";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

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
  }
};

const ActivityFeed = () => {
  const { data: activities = [] } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const storedActivities = localStorage.getItem('activities');
      return storedActivities ? JSON.parse(storedActivities) : [];
    },
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity: Activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 rounded-lg p-3 transition-colors hover:bg-gray-100"
              >
                {getActivityIcon(activity.type)}
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
            {activities.length === 0 && (
              <p className="text-center text-gray-500">No recent activity</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;