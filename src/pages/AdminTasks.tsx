import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "@/types/task";
import { Upload } from "lucide-react";
import * as XLSX from 'xlsx';
import { toast } from "sonner";

const AdminTasks = () => {
  const queryClient = useQueryClient();

  const { data: availableTasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const tasks = localStorage.getItem('tasks');
      return tasks ? JSON.parse(tasks) : [];
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const processedTasks = jsonData.map((row: any) => {
              const isGenAi = row.TaskCategory?.toLowerCase() === 'genai';
              const deadline = new Date();
              deadline.setHours(16, 0, 0, 0);

              return {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                code: row.UniqueCode || `TSK${Date.now()}`,
                title: row.TaskTitle || `${row.TaskCategory} Task`,
                description: row.TaskDescription || '',
                category: isGenAi ? 'genai' : 'creai',
                payout: isGenAi ? 500 : 250,
                taskerPayout: isGenAi ? 400 : 200,
                platformFee: isGenAi ? 100 : 50,
                bidsNeeded: isGenAi ? 10 : 5,
                currentBids: 0,
                datePosted: new Date().toISOString(),
                deadline: deadline.toISOString(),
                status: "pending",
                bidders: [],
                selectedTaskers: [],
                submissions: [],
                rating: 0,
                totalRatings: 0
              };
            });

            localStorage.setItem('tasks', JSON.stringify(processedTasks));
            resolve(processedTasks);
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsArrayBuffer(file);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Tasks uploaded successfully");
    },
    onError: () => {
      toast.error("Failed to upload tasks");
    }
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin>
        <div className="p-6">
          <h2 className="text-2xl font-bold">Task Management</h2>
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Available Tasks</CardTitle>
              <div className="relative">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button className="flex items-center gap-2">
                  <Upload size={16} />
                  Upload Tasks
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Unique Code</TableHead>
                    <TableHead>Bids</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableTasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No tasks available. Upload tasks to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    availableTasks.map((task: Task) => (
                      <TableRow key={task.id}>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{task.description}</TableCell>
                        <TableCell>{task.category}</TableCell>
                        <TableCell>{task.code}</TableCell>
                        <TableCell>{task.currentBids}/{task.bidsNeeded}</TableCell>
                        <TableCell>{task.status}</TableCell>
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

export default AdminTasks;
