import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface SubmittedTask {
  id: string;
  taskId: string;
  taskTitle: string;
  fileName: string;
  submittedAt: string;
  status: string;
}

const AdminSubmittedTasks = () => {
  const { data: submittedTasks = [] } = useQuery({
    queryKey: ['submitted-tasks'],
    queryFn: async () => {
      const tasks = localStorage.getItem('taskSubmissions');
      return tasks ? JSON.parse(tasks) : [];
    }
  });

  const handleSubmitResult = (taskId: string) => {
    toast.success("Result submitted successfully");
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
                    submittedTasks.map((task: SubmittedTask) => (
                      <TableRow key={task.id}>
                        <TableCell>{task.taskTitle}</TableCell>
                        <TableCell>{task.fileName}</TableCell>
                        <TableCell>{new Date(task.submittedAt).toLocaleDateString()}</TableCell>
                        <TableCell>{task.status}</TableCell>
                        <TableCell>
                          <Button 
                            onClick={() => handleSubmitResult(task.id)}
                            className="bg-white text-[#1E40AF] border border-[#1E40AF] hover:bg-[#1E40AF] hover:text-white"
                          >
                            Submit Result
                          </Button>
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