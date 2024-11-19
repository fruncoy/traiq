import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Sidebar from "../Sidebar";
import { useQuery } from "@tanstack/react-query";

const NotificationsPage = () => {
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const stored = localStorage.getItem('notifications');
      if (!stored) {
        const defaultNotifications = [
          {
            id: '1',
            title: 'Welcome to TRAIQ',
            message: 'Start bidding on tasks to earn money!',
            type: 'info',
            date: new Date().toISOString()
          }
        ];
        localStorage.setItem('notifications', JSON.stringify(defaultNotifications));
        return defaultNotifications;
      }
      return JSON.parse(stored);
    },
    refetchInterval: 5000
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
                    className="p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-[#1E40AF]">{notification.title}</h3>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`${
                          notification.type === 'success' 
                            ? 'bg-green-100 text-green-800' 
                            : notification.type === 'error'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
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