import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Sidebar from "../Sidebar";
import { Task } from "@/types/task";

const BiddedTasksPage = () => {
  const { data: userTasks = [] } = useQuery({
    queryKey: ['user-active-tasks'],
    queryFn: async () => {
      const tasks = localStorage.getItem('userActiveTasks');
      return tasks ? JSON.parse(tasks) : [];
    }
  });

  return (
    <Sidebar>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Bidded Tasks</h1>
        <div className="space-y-4">
          {userTasks.length === 0 ? (
            <p className="text-center text-gray-500 py-4">You haven't bid on any tasks yet</p>
          ) : (
            userTasks.map((task: Task) => (
              <Card key={task.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Payout: KES {task.payout}</span>
                      <Badge variant={task.status === 'active' ? 'default' : 'secondary'}>
                        {task.status || 'pending'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default BiddedTasksPage;