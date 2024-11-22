import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Task } from "@/types/task";
import { TaskSubmissionHistory } from "./TaskSubmissionHistory";
import { SubmissionActions } from "./SubmissionActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface SubmissionListProps {
  tasks: Task[];
  selectedTaskerId: string | null;
  setSelectedTaskerId: (id: string | null) => void;
}

export const SubmissionList = ({ tasks, selectedTaskerId, setSelectedTaskerId }: SubmissionListProps) => {
  const queryClient = useQueryClient();

  const { mutate: handleSubmissionAction } = useMutation({
    mutationFn: async ({ taskId, bidderId, action, reason }: { 
      taskId: string; 
      bidderId: string; 
      action: 'approved' | 'rejected'; 
      reason?: string;
    }) => {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const task = tasks.find((t: Task) => t.id === taskId);
      
      if (!task) throw new Error("Task not found");
      
      const updatedTasks = tasks.map((t: Task) => {
        if (t.id === taskId) {
          const updatedSubmissions = t.submissions?.map(s => {
            if (s.bidderId === bidderId) {
              return { 
                ...s, 
                status: action,
                ...(reason && { rejectionReason: reason })
              };
            }
            return s;
          });
          return { ...t, submissions: updatedSubmissions };
        }
        return t;
      });
      
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      
      // Update taskSubmissions for history
      const submissions = JSON.parse(localStorage.getItem('taskSubmissions') || '[]');
      const newSubmission = {
        bidderId,
        taskId,
        taskCode: task.code,
        status: action,
        submittedAt: new Date().toISOString()
      };
      localStorage.setItem('taskSubmissions', JSON.stringify([...submissions, newSubmission]));
      
      // Add notification for the tasker
      const notifications = JSON.parse(localStorage.getItem(`notifications_${bidderId}`) || '[]');
      notifications.unshift({
        id: Date.now().toString(),
        title: `Submission ${action}`,
        message: `Task ${task.code} submission has been ${action}`,
        type: action === 'approved' ? 'success' : 'error',
        read: false,
        date: new Date().toISOString(),
        taskerId: bidderId
      });
      localStorage.setItem(`notifications_${bidderId}`, JSON.stringify(notifications));
      
      return updatedTasks;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Submission status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update submission status");
    }
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead>Tasker ID</TableHead>
          <TableHead>File</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>History</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          task.submissions?.map((submission) => (
            <TableRow key={`${task.id}-${submission.bidderId}`}>
              <TableCell>
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-gray-500">{task.code}</p>
                </div>
              </TableCell>
              <TableCell>{submission.bidderId}</TableCell>
              <TableCell>{submission.fileName}</TableCell>
              <TableCell>
                {new Date(submission.submittedAt || '').toLocaleString()}
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  submission.status === 'approved' 
                    ? 'bg-green-100 text-green-800'
                    : submission.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {submission.status}
                </span>
              </TableCell>
              <TableCell>
                <TaskSubmissionHistory taskerId={submission.bidderId} />
              </TableCell>
              <TableCell>
                {submission.status === 'pending' && (
                  <SubmissionActions
                    onAction={(action, reason) => 
                      handleSubmissionAction({
                        taskId: task.id,
                        bidderId: submission.bidderId,
                        action,
                        reason
                      })
                    }
                    isPending={false}
                  />
                )}
              </TableCell>
            </TableRow>
          ))
        ))}
      </TableBody>
    </Table>
  );
};