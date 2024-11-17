import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: "info" | "success" | "warning";
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "Bid Accepted",
    message: "Your bid for 'Translate Short Stories' has been accepted",
    date: "2024-02-20",
    type: "success",
    read: false
  },
  {
    id: "2",
    title: "Task Due Soon",
    message: "Task 'Cultural Essays' is due in 24 hours",
    date: "2024-02-19",
    type: "warning",
    read: false
  }
];

const NotificationsPage = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg ${
                  !notification.read ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{notification.title}</h3>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                  <Badge
                    variant={
                      notification.type === "success" ? "default" :
                      notification.type === "warning" ? "destructive" : "secondary"
                    }
                  >
                    {notification.type}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500">{notification.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;