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
      localStorage.setItem('taskers', JSON.stringify(updatedTaskers));
      return updatedTaskers;
    },
    onSuccess: () => {
      toast.success("Tasker account status updated successfully", {
        position: "bottom-right"
      });
      refetch();
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
        position: "bottom-right"
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taskers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No taskers registered yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    taskers.map((tasker: Tasker) => (
                      <TableRow key={tasker.id}>
                        <TableCell>{tasker.username}</TableCell>
                        <TableCell>{tasker.email}</TableCell>
                        <TableCell>{tasker.tasksCompleted || 0}</TableCell>
                        <TableCell>KES {tasker.totalPayouts || 0}</TableCell>
                        <TableCell>{new Date(tasker.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => suspendMutation.mutate(tasker.id)}
                              className="text-white bg-primary hover:bg-primary/90"
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
                              className="text-white bg-destructive hover:bg-destructive/90"
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