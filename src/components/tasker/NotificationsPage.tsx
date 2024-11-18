import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Sidebar from "../Sidebar";
import { useQuery } from "@tanstack/react-query";

const NotificationsPage = () => {
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const stored = localStorage.getItem('notifications');
      return stored ? JSON.parse(stored) : [];
    },
    refetchInterval: 5000 // Refresh every 5 seconds for real-time updates
  });

  return (
    <Sidebar>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No notifications yet</p>
              ) : (
                notifications.map((notification: any) => (
                  <div
                    key={notification.id}
                    className="p-4 border rounded-lg bg-white"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-[#1E40AF]">{notification.title}</h3>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-[#1E40AF] text-white"
                      >
                        {notification.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{new Date(notification.date).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
};

export default NotificationsPage;