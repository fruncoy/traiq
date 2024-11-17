import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SubmittedTask {
  id: string;
  taskTitle: string;
  submittedBy: string;
  submittedDate: string;
  description: string;
}

const submittedTasks: SubmittedTask[] = [];

const AdminSubmittedTasks = () => {
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
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submittedTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.taskTitle}</TableCell>
                      <TableCell>{task.submittedBy}</TableCell>
                      <TableCell>{task.submittedDate}</TableCell>
                      <TableCell>{task.description}</TableCell>
                      <TableCell>
                        <Button 
                          onClick={() => handleSubmitResult(task.id)}
                          className="bg-white text-[#1E40AF] border border-[#1E40AF] hover:bg-[#1E40AF] hover:text-white"
                        >
                          Submit Result
                        </Button>
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

export default AdminSubmittedTasks;