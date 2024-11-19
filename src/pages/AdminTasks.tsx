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

  const { data: activeTasks = [] } = useQuery({
    queryKey: ['active-tasks'],
    queryFn: async () => {
      const tasks = localStorage.getItem('activeTasks');
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
                title: `${row.TaskCategory} Task`,
                description: row.TaskDescription,
                category: isGenAi ? 'short_essay' : 'long_essay',
                payout: isGenAi ? 500 : 250,
                taskerPayout: isGenAi ? 400 : 200,
                platformFee: isGenAi ? 100 : 50,
                workingTime: "24 hours",
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

            const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            const updatedTasks = [...existingTasks, ...processedTasks];
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            resolve(updatedTasks);
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

  const renderTaskTable = (tasks: Task[], title: string) => (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {title === 'Available Tasks' && (
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
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Bids</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No {title.toLowerCase()} found
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.category}</TableCell>
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