import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { TaskerSubmissionHistory } from "./TaskerSubmissionHistory";

interface TaskSubmissionsTableProps {
  task: any;
  onAction: (taskId: string, bidderId: string, action: 'approved' | 'rejected', reason?: string) => void;
  isPending: boolean;
  allSubmissions: any[];
}

export const TaskSubmissionsTable = ({ task, onAction, isPending, allSubmissions }: TaskSubmissionsTableProps) => {
  const [selectedTaskerId, setSelectedTaskerId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Get ALL submissions for this task from localStorage
  const taskSubmissions = JSON.parse(localStorage.getItem('taskSubmissions') || '[]')
    .filter((submission: any) => submission.taskId === task.id);

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
        {taskSubmissions.map((submission: any) => {
          const tasker = JSON.parse(localStorage.getItem('taskers') || '[]')
            .find((t: any) => t.id === submission.bidderId);
            
          return (
            <TableRow key={`${submission.taskId}-${submission.bidderId}-${submission.submittedAt}`}>
              <TableCell>{submission.bidderId}</TableCell>
              <TableCell>{tasker?.username || 'Unknown'}</TableCell>
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
                <Dialog open={showHistory && selectedTaskerId === submission.bidderId} 
                       onOpenChange={(open) => !open && setShowHistory(false)}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedTaskerId(submission.bidderId);
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
                      submissions={allSubmissions} 
                      taskerId={submission.bidderId} 
                    />
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell>
                {submission.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onAction(task.id, submission.bidderId, 'approved')}
                      disabled={isPending}
                      variant="default"
                      size="sm"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => onAction(task.id, submission.bidderId, 'rejected', 'Rejected by admin')}
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
          );
        })}
      </TableBody>
    </Table>
  );
};