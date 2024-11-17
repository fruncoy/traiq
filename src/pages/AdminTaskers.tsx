import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";

interface Tasker {
  id: string;
  name: string;
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
      // This would be replaced with actual API call
      return [] as Tasker[];
    }
  });

  const suspendMutation = useMutation({
    mutationFn: async (taskerId: string) => {
      // This would be replaced with actual API call
      toast.success("Tasker account status updated successfully");
    },
    onSuccess: () => {
      refetch();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (taskerId: string) => {
      // This would be replaced with actual API call
      toast.success("Tasker account deleted successfully");
    },
    onSuccess: () => {
      refetch();
    }
  });

  const handleSuspendTasker = (taskerId: string) => {
    suspendMutation.mutate(taskerId);
  };

  const handleDeleteTasker = (taskerId: string) => {
    deleteMutation.mutate(taskerId);
  };

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
                    <TableHead>Name</TableHead>
                    <TableHead>Tasks Completed</TableHead>
                    <TableHead>Total Payouts</TableHead>
                    <TableHead>Pending Payouts</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taskers.map((tasker) => (
                    <TableRow key={tasker.id}>
                      <TableCell>{tasker.name}</TableCell>
                      <TableCell>{tasker.tasksCompleted}</TableCell>
                      <TableCell>Ksh {tasker.totalPayouts}</TableCell>
                      <TableCell>Ksh {tasker.pendingPayouts}</TableCell>
                      <TableCell>{tasker.joinDate}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuspendTasker(tasker.id)}
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
                            onClick={() => handleDeleteTasker(tasker.id)}
                            className="text-white bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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