import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import Sidebar from "../Sidebar";

const SubmitTaskPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const { data: activeTasks = [] } = useQuery({
    queryKey: ['active-tasks'],
    queryFn: async () => {
      const tasks = localStorage.getItem('activeTasks');
      return tasks ? JSON.parse(tasks) : [];
    }
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ['my-submissions'],
    queryFn: async () => {
      const subs = localStorage.getItem('taskSubmissions');
      return subs ? JSON.parse(subs) : [];
    },
    refetchInterval: 5000
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) {
      toast.error("Please select a task");
      return;
    }
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setUploading(true);
    try {
      const submissions = JSON.parse(localStorage.getItem('taskSubmissions') || '[]');
      submissions.push({
        id: Date.now().toString(),
        taskId: selectedTask,
        taskTitle: activeTasks.find(t => t.id === selectedTask)?.title,
        fileName: file.name,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      });
      localStorage.setItem('taskSubmissions', JSON.stringify(submissions));
      
      toast.success("Task submitted successfully!", {
        description: "Your submission will be reviewed by our team."
      });
      setFile(null);
      setSelectedTask("");
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      toast.error("Failed to submit task. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Sidebar>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Submit Completed Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Task</label>
                <Select value={selectedTask} onValueChange={setSelectedTask}>
                  <SelectTrigger className="w-full bg-white border-[#1E40AF] text-[#1E40AF]">
                    <SelectValue placeholder="Select a task to submit" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {activeTasks.map((task: any) => (
                      <SelectItem key={task.id} value={task.id}>
                        {task.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload Task File</label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={!selectedTask || !file || uploading}
                    className="bg-[#1E40AF] hover:bg-[#1E40AF]/90 flex items-center gap-2"
                  >
                    <Upload size={16} />
                    {uploading ? "Uploading..." : "Submit"}
                  </Button>
                </div>
                {file && (
                  <p className="text-sm text-gray-600">
                    Selected file: {file.name}
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {submissions.length === 0 ? (
                <p className="text-center text-gray-500">No submissions yet</p>
              ) : (
                submissions.map((submission: any) => (
                  <div key={submission.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-[#1E40AF]">{submission.taskTitle}</h3>
                        <p className="text-sm text-gray-600">File: {submission.fileName}</p>
                        <p className="text-sm text-gray-500">
                          Submitted: {new Date(submission.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      <Badge
                        variant={submission.status === 'approved' ? 'default' : 
                                submission.status === 'rejected' ? 'destructive' : 'secondary'}
                        className={submission.status === 'approved' ? 'bg-[#1E40AF]' : ''}
                      >
                        {submission.status}
                      </Badge>
                    </div>
                    {submission.rejectionReason && (
                      <p className="mt-2 text-sm text-red-500">
                        Reason: {submission.rejectionReason}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
};

export default SubmitTaskPage;