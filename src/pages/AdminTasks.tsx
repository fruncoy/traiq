import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Task } from "@/types/task";

const AdminTasks = () => {
  const { data: availableTasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const tasks = localStorage.getItem('tasks');
      return tasks ? JSON.parse(tasks) : [];
    }
  });

  const { data: activeTasks = [] } = useQuery({
    queryKey: ['active-tasks'],
    queryFn: async () => {
      const tasks = localStorage.getItem('activeTasks');
      return tasks ? JSON.parse(tasks) : [];
    }
  });

  const renderTaskTable = (tasks: Task[], title: string) => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Payout</TableHead>
              <TableHead>Working Time</TableHead>
              <TableHead>Bids</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No {title.toLowerCase()} found
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>KES {task.payout}</TableCell>
                  <TableCell>{task.workingTime}</TableCell>
                  <TableCell>{task.currentBids}/{task.bidsNeeded}</TableCell>
                  <TableCell>{task.status || 'pending'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin>
        <div className="p-6">
          <h2 className="text-2xl font-bold">Task Management</h2>
          {renderTaskTable(availableTasks.filter(t => !t.status || t.status === 'pending'), 'Available Tasks')}
          {renderTaskTable(activeTasks, 'Active Tasks')}
        </div>
      </Sidebar>
    </div>
  );
};

export default AdminTasks;