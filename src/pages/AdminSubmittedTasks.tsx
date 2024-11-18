import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const rejectionReasons = [
  "Poor quality",
  "Incomplete work",
  "Plagiarized content",
  "Wrong format",
  "Other"
];

const AdminSubmittedTasks = () => {
  const queryClient = useQueryClient();

  const { data: submittedTasks = [], refetch } = useQuery({
    queryKey: ['submitted-tasks'],
    queryFn: async () => {
      const tasks = localStorage.getItem('taskSubmissions');
      return tasks ? JSON.parse(tasks) : [];
    }
  });

  const handleApprove = (taskId: string) => {
    const tasks = JSON.parse(localStorage.getItem('taskSubmissions') || '[]');
    const updatedTasks = tasks.map((task: any) => 
      task.id === taskId ? { ...task, status: 'approved' } : task
    );
    localStorage.setItem('taskSubmissions', JSON.stringify(updatedTasks));
    queryClient.invalidateQueries({ queryKey: ['submitted-tasks'] });
    toast.success("Task approved successfully");
    refetch();
  };

  const handleReject = (taskId: string, reason: string) => {
    const tasks = JSON.parse(localStorage.getItem('taskSubmissions') || '[]');
    const updatedTasks = tasks.map((task: any) => 
      task.id === taskId ? { ...task, status: 'rejected', rejectionReason: reason } : task
    );
    localStorage.setItem('taskSubmissions', JSON.stringify(updatedTasks));
    queryClient.invalidateQueries({ queryKey: ['submitted-tasks'] });
    toast.error("Task rejected");
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#1E40AF]">Submitted Tasks</h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task Title</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Submitted Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submittedTasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No tasks have been submitted yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    submittedTasks.map((task: any) => (
                      <TableRow key={task.id}>
                        <TableCell>{task.taskTitle}</TableCell>
                        <TableCell>{task.fileName}</TableCell>
                        <TableCell>{new Date(task.submittedAt).toLocaleDateString()}</TableCell>
                        <TableCell>{task.status}</TableCell>
                        <TableCell>
                          {task.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleApprove(task.id)}
                                className="bg-[#1E40AF] hover:bg-[#1E40AF]/90"
                              >
                                Approve
                              </Button>
                              <Select onValueChange={(value) => handleReject(task.id, value)}>
                                <SelectTrigger className="w-[180px] bg-white border-[#1E40AF] text-[#1E40AF]">
                                  <SelectValue placeholder="Reject" />
                                </SelectTrigger>
                                <SelectContent>
                                  {rejectionReasons.map((reason) => (
                                    <SelectItem key={reason} value={reason}>
                                      {reason}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
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

export default AdminSubmittedTasks;