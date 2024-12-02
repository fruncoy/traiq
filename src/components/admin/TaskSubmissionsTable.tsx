import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { TaskerSubmissionHistory } from "./TaskerSubmissionHistory";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TaskSubmissionsTableProps {
  task: any;
  onAction: (taskId: string, bidderId: string, action: 'approved' | 'rejected', reason?: string) => void;
  isPending: boolean;
}

export const TaskSubmissionsTable = ({ task, onAction, isPending }: TaskSubmissionsTableProps) => {
  const [selectedTaskerId, setSelectedTaskerId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Fetch submissions for this task
  const { data: submissions = [] } = useQuery({
    queryKey: ['task-submissions', task.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('task_submissions')
        .select(`
          *,
          profiles:bidder_id (
            username,
            email
          )
        `)
        .eq('task_id', task.id);

      if (error) throw error;
      return data;
    }
  });

  // Fetch tasker's submission history when needed
  const { data: taskerHistory = [] } = useQuery({
    queryKey: ['tasker-submissions', selectedTaskerId],
    queryFn: async () => {
      if (!selectedTaskerId) return [];
      
      const { data, error } = await supabase
        .from('task_submissions')
        .select('*')
        .eq('bidder_id', selectedTaskerId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedTaskerId
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tasker ID</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>File</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>History</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((submission: any) => (
          <TableRow key={`${submission.task_id}-${submission.bidder_id}`}>
            <TableCell>{submission.bidder_id}</TableCell>
            <TableCell>{submission.profiles?.username || 'Unknown'}</TableCell>
            <TableCell>
              <a 
                href={submission.file_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {submission.file_name}
              </a>
            </TableCell>
            <TableCell>
              {new Date(submission.submitted_at).toLocaleString()}
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
              <Dialog 
                open={showHistory && selectedTaskerId === submission.bidder_id} 
                onOpenChange={(open) => !open && setShowHistory(false)}
              >
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedTaskerId(submission.bidder_id);
                    setShowHistory(true);
                  }}
                >
                  View History
                </Button>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>Tasker Submission History</DialogTitle>
                  </DialogHeader>
                  <TaskerSubmissionHistory 
                    submissions={taskerHistory} 
                    taskerId={submission.bidder_id} 
                  />
                </DialogContent>
              </Dialog>
            </TableCell>
            <TableCell>
              {submission.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => onAction(task.id, submission.bidder_id, 'approved')}
                    disabled={isPending}
                    variant="default"
                    size="sm"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => onAction(task.id, submission.bidder_id, 'rejected')}
                    disabled={isPending}
                    variant="destructive"
                    size="sm"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};