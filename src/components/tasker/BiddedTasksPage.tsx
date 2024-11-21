import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Sidebar from "../Sidebar";
import { Task } from "@/types/task";
import { format, isValid, parseISO } from "date-fns";

const BiddedTasksPage = () => {
  const { data: userTasks = [] } = useQuery({
    queryKey: ['user-active-tasks'],
    queryFn: async () => {
      const tasks = localStorage.getItem('userActiveTasks');
      return tasks ? JSON.parse(tasks) : [];
    }
  });

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        return 'Invalid date';
      }
      return format(date, "MMM d, yyyy");
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

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
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{task.title}</h3>
                        <p className="text-sm text-gray-600">{task.code}</p>
                        <p className="text-sm text-gray-700">{task.description}</p>
                      </div>
                      <Badge variant="outline">
                        Deadline: {formatDate(task.deadline)}
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