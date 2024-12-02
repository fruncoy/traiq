import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Task, TaskCategory } from "@/types/task";
import { Upload } from "lucide-react";
import * as XLSX from 'xlsx';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AdminTasks = () => {
  const queryClient = useQueryClient();

  const { data: availableTasks = [], isLoading } = useQuery({
    queryKey: ['admin-tasks'],
    queryFn: async () => {
      const { data: tasksData, error } = await supabase
        .from('tasks')
        .select(`
          *,
          task_bidders!left (
            bidder_id
          ),
          task_submissions!left (
            id,
            status,
            bidder_id,
            file_url,
            submitted_at
          )
        `)
        .not('status', 'eq', 'archived')  // Don't show archived tasks
        .order('created_at', { ascending: false });

      if (error) throw error;

      return tasksData.map((task: any) => ({
        ...task,
        category: task.category as TaskCategory,
        bidders: task.task_bidders || [],
        submissions: task.task_submissions || []
      }));
    },
    refetchInterval: 5000
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error: tasksError } = await supabase
        .from('tasks')
        .delete()
        .eq('status', 'archived');

      if (tasksError) throw tasksError;

      const { error: submissionsError } = await supabase
        .from('task_submissions')
        .delete()
        .eq('status', 'approved');

      if (submissionsError) throw submissionsError;

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tasks'] });
      toast.success("Successfully deleted archived tasks and approved submissions");
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error("Failed to delete tasks and submissions");
    }
  });

  const handleDeleteArchived = () => {
    if (window.confirm("Are you sure you want to delete all archived tasks and their approved submissions? This action cannot be undone.")) {
      deleteMutation.mutate();
    }
  };

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const processedTasks = jsonData.map((row: any) => ({
              code: row.UniqueCode,
              title: row.Title,
              description: row.Description,
              category: (row.Category?.toLowerCase() === 'genai' ? 'genai' : 'creai') as TaskCategory,
              payout: row.Category?.toLowerCase() === 'genai' ? 500 : 250,
              tasker_payout: row.Category?.toLowerCase() === 'genai' ? 400 : 200,
              platform_fee: row.Category?.toLowerCase() === 'genai' ? 100 : 50,
              bids_needed: row.Category?.toLowerCase() === 'genai' ? 10 : 5,
              max_bidders: 10,
              current_bids: 0,
              deadline: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
              status: "pending"
            }));

            const { data: insertedData, error: insertError } = await supabase
              .from('tasks')
              .insert(processedTasks)
              .select();

            if (insertError) throw insertError;
            return insertedData;
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsArrayBuffer(file);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tasks'] });
      toast.success("Tasks uploaded successfully");
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast.error("Failed to upload tasks");
    }
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar isAdmin>
          <div className="p-6">
            <h2 className="text-2xl font-bold">Loading...</h2>
          </div>
        </Sidebar>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin>
        <div className="p-6">
          <h2 className="text-2xl font-bold">Task Management</h2>
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>All Tasks ({availableTasks.length})</CardTitle>
              <div className="flex gap-4">
                <Button 
                  variant="destructive"
                  onClick={handleDeleteArchived}
                  disabled={deleteMutation.isPending}
                >
                  Delete Archived Tasks
                </Button>
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
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Total Bidders</TableHead>
                    <TableHead>Submissions</TableHead>
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
                        <TableCell className="capitalize">{task.category}</TableCell>
                        <TableCell>{task.bidders.length}/10</TableCell>
                        <TableCell>{task.submissions.length}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            task.status === 'archived' 
                              ? 'bg-red-100 text-red-800'
                              : task.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {task.status}
                          </span>
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

export default AdminTasks;