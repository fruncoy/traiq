import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";

interface Tasker {
  id: string;
  username: string;
  email: string;
  tasksCompleted: number;
  totalPayouts: number;
  pendingPayouts: number;
  joinDate: string;
  isSuspended: boolean;
}

const AdminTaskers = () => {
  const { data: taskers = [], refetch } = useQuery({
    queryKey: ['taskers'],
    queryFn: async () => {
      const storedTaskers = localStorage.getItem('taskers');
      return storedTaskers ? JSON.parse(storedTaskers) : [];
    }
  });

  const suspendMutation = useMutation({
    mutationFn: async (taskerId: string) => {
      const taskers = JSON.parse(localStorage.getItem('taskers') || '[]');
      const updatedTaskers = taskers.map((t: Tasker) => 
        t.id === taskerId ? { ...t, isSuspended: !t.isSuspended } : t
      );
      
      // Update taskers in localStorage
      localStorage.setItem('taskers', JSON.stringify(updatedTaskers));
      
      // Update active tasks to remove suspended tasker's bids
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const updatedTasks = tasks.map((task: any) => {
        if (task.bidders?.includes(taskerId) && task.status === 'active') {
          return {
            ...task,
            bidders: task.bidders.filter((bid: string) => bid !== taskerId),
            currentBids: task.currentBids - 1
          };
        }
        return task;
      });
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      
      return updatedTaskers;
    },
    onSuccess: (_, taskerId) => {
      const tasker = taskers.find((t: Tasker) => t.id === taskerId);
      const action = tasker?.isSuspended ? 'activated' : 'suspended';
      
      toast.success(`Tasker account ${action} successfully`, {
        description: `${tasker?.username}'s account has been ${action}`,
        duration: 5000,
      });
      
      refetch();
    },
    onError: (error: Error) => {
      toast.error("Failed to update tasker status", {
        description: error.message,
        duration: 5000,
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (taskerId: string) => {
      const taskers = JSON.parse(localStorage.getItem('taskers') || '[]');
      const updatedTaskers = taskers.filter((t: Tasker) => t.id !== taskerId);
      localStorage.setItem('taskers', JSON.stringify(updatedTaskers));
      return updatedTaskers;
    },
    onSuccess: () => {
      toast.success("Tasker account deleted successfully", {
        duration: 5000,
      });
      refetch();
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Tasker Management</h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tasker List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tasks Completed</TableHead>
                    <TableHead>Total Payouts</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taskers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No taskers registered yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    taskers.map((tasker: Tasker) => (
                      <TableRow key={tasker.id} className={tasker.isSuspended ? "bg-red-50" : ""}>
                        <TableCell>{tasker.username}</TableCell>
                        <TableCell>{tasker.email}</TableCell>
                        <TableCell>{tasker.tasksCompleted || 0}</TableCell>
                        <TableCell>KES {tasker.totalPayouts || 0}</TableCell>
                        <TableCell>{new Date(tasker.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            tasker.isSuspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {tasker.isSuspended ? 'Suspended' : 'Active'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => suspendMutation.mutate(tasker.id)}
                              className={`text-white ${
                                tasker.isSuspended 
                                  ? 'bg-green-500 hover:bg-green-600' 
                                  : 'bg-red-500 hover:bg-red-600'
                              }`}
                            >
                              {tasker.isSuspended ? (
                                <UserCheck className="h-4 w-4 mr-2" />
                              ) : (
                                <UserX className="h-4 w-4 mr-2" />
                              )}
                              {tasker.isSuspended ? "Activate" : "Suspend"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteMutation.mutate(tasker.id)}
                              className="text-white bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </Sidebar>
    </div>
  );
};

export default AdminTaskers;