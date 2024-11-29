import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Task, TaskCategory } from "@/types/task";
import { supabase } from "@/integrations/supabase/client";
import { formatInTimeZone } from 'date-fns-tz';
import { TaskSelect } from "./TaskSelect";
import { getDeadline, isSubmissionAllowed } from "@/utils/deadlineUtils";
import { useDropzone } from 'react-dropzone';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

const TaskSubmissionForm = () => {
  const [selectedTask, setSelectedTask] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { data: activeTasks = [] } = useQuery({
    queryKey: ['user-active-tasks'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: tasksData, error } = await supabase
        .from('tasks')
        .select(`
          *,
          task_bidders!inner (
            bidder_id,
            bid_date
          ),
          task_submissions!left (*)
        `)
        .eq('task_bidders.bidder_id', user.id)
        .eq('status', 'active')
        .neq('status', 'expired');

      if (error) throw error;

      return tasksData
        .filter((task: any) => {
          const hasSubmitted = task.task_submissions?.some((s: any) => s.bidder_id === user.id);
          return !hasSubmitted;
        })
        .map((task: any) => ({
          ...task,
          category: task.category as TaskCategory,
          bidders: task.task_bidders || [],
          submissions: task.task_submissions || []
        }));
    },
    refetchInterval: 30000
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 10MB limit");
      return;
    }
    setFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  });

  const submitTaskMutation = useMutation({
    mutationFn: async ({ task, file }: { task: Task, file: File }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size exceeds 10MB limit');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${task.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('task-submissions')
        .upload(fileName, file);

      if (uploadError) {
        if (uploadError.message.includes('size')) {
          throw new Error('File size exceeds the maximum limit of 10MB');
        }
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { error: submissionError } = await supabase
        .from('task_submissions')
        .insert({
          task_id: task.id,
          bidder_id: user.id,
          file_name: file.name,
          file_url: fileName,
          status: 'pending'
        });

      if (submissionError) throw submissionError;
    },
    onSuccess: () => {
      toast.success("Task submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ['user-active-tasks'] });
      setSelectedTask("");
      setFile(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit task");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) {
      toast.error("Please select a task");
      return;
    }
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const task = activeTasks.find(t => t.id === selectedTask);
    if (task) {
      submitTaskMutation.mutate({ task, file });
    }
  };

  const selectedTaskData = activeTasks.find(t => t.id === selectedTask);
  const taskBidder = selectedTaskData?.task_bidders?.find(b => b.bid_date);
  const now = new Date();
  const eatTime = formatInTimeZone(now, 'Africa/Nairobi', 'HH:mm');
  const [hours] = eatTime.split(':').map(Number);

  // Check if deadline is approaching (less than 2 hours)
  const deadline = taskBidder?.bid_date ? getDeadline(taskBidder.bid_date) : null;
  const isDeadlineApproaching = deadline && 
    (new Date(deadline).getTime() - new Date().getTime()) < 2 * 60 * 60 * 1000;

  if (isDeadlineApproaching) {
    toast.warning(`Deadline approaching for task submission! Due by ${deadline?.toLocaleString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TaskSelect 
        tasks={activeTasks}
        selectedTask={selectedTask}
        onSelect={setSelectedTask}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">Upload File (Max 10MB)</label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
            ${file ? 'bg-green-50 border-green-500' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            {isDragActive ? (
              <p>Drop the file here...</p>
            ) : file ? (
              <p className="text-green-600">Selected: {file.name}</p>
            ) : (
              <p>Drag and drop a file here, or click to select</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
            </p>
          </div>
        </div>
        {taskBidder?.bid_date && (
          <p className={`text-sm ${!isSubmissionAllowed(taskBidder.bid_date) ? 'text-red-500' : 
            isDeadlineApproaching ? 'text-orange-500' : 'text-gray-500'}`}>
            Deadline: {getDeadline(taskBidder.bid_date).toLocaleString()} EAT
          </p>
        )}
      </div>

      <Button 
        type="submit" 
        disabled={!selectedTask || !file || submitTaskMutation.isPending || !isSubmissionAllowed(taskBidder?.bid_date)}
        className="w-full bg-primary hover:bg-primary/90"
      >
        {submitTaskMutation.isPending ? "Processing..." : "Submit Task"}
      </Button>
    </form>
  );
};

export default TaskSubmissionForm;