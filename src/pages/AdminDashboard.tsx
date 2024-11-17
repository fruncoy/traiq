import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardMetrics from "../components/DashboardMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

interface Activity {
  id: string;
  type: "submission" | "approval" | "rejection" | "pending";
  message: string;
  timestamp: string;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      type: "submission",
      message: "New task submission from John Doe",
      timestamp: "2 minutes ago"
    },
    {
      id: "2",
      type: "approval",
      message: "Task #123 approved",
      timestamp: "5 minutes ago"
    },
    {
      id: "3",
      type: "rejection",
      message: "Bid rejected for Task #456",
      timestamp: "10 minutes ago"
    },
    {
      id: "4",
      type: "pending",
      message: "New tasker registration pending approval",
      timestamp: "15 minutes ago"
    }
  ]);

  const metrics = [
    { 
      label: "Total Tasks", 
      value: "156", 
      change: "+12% from last month",
      description: "Active tasks in the system" 
    },
    { 
      label: "Submissions", 
      value: "43", 
      change: "+5% from last month",
      description: "Pending review" 
    },
    { 
      label: "Approval Rate", 
      value: "89%", 
      change: "+2% from last month",
      description: "Task approval rate" 
    },
    { 
      label: "Total Earnings", 
      value: "Ksh 12,543", 
      change: "+18% from last month",
      description: "Platform revenue" 
    }
  ];

  const getActivityIcon = (type: Activity["type"]) => {
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

  useEffect(() => {
    // Simulate new notification
    const timer = setTimeout(() => {
      toast({
        title: "New Submission",
        description: "A new task submission requires your review",
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin />
      <div className="lg:pl-64">
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {metric.description}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {metric.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {activities.map((activity) => (
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
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium">Review Tasks</h3>
                    <p className="text-sm text-gray-500">Check pending submissions</p>
                  </button>
                  <button className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium">Manage Bids</h3>
                    <p className="text-sm text-gray-500">Review and approve bids</p>
                  </button>
                  <button className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium">Process Payments</h3>
                    <p className="text-sm text-gray-500">Handle pending payouts</p>
                  </button>
                  <button className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium">Tasker Approvals</h3>
                    <p className="text-sm text-gray-500">Review new registrations</p>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;