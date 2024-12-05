import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { useState } from "react";

interface TaskListProps {
  tasks: Task[];
  title: string;
  count: number;
  onDelete: (taskIds: string[]) => void;
  onToggleStatus: (taskIds: string[], newStatus: 'active' | 'inactive') => void;
  children?: React.ReactNode;
}

export const TaskList = ({ 
  tasks, 
  title, 
  count, 
  onDelete, 
  onToggleStatus,
  children 
}: TaskListProps) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedTasks(checked ? tasks.map(t => t.id) : []);
  };

  const handleSelectTask = (taskId: string, checked: boolean) => {
    setSelectedTasks(prev => 
      checked ? [...prev, taskId] : prev.filter(id => id !== taskId)
    );
  };

  const isInactive = tasks.length > 0 && tasks[0].status === 'inactive';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title} ({count})</CardTitle>
        <div className="flex gap-4">
          {selectedTasks.length > 0 && (
            <>
              <Button
                variant="destructive"
                onClick={() => onDelete(selectedTasks)}
              >
                Delete Selected ({selectedTasks.length})
              </Button>
              <Button
                variant="secondary"
                onClick={() => onToggleStatus(selectedTasks, isInactive ? 'active' : 'inactive')}
              >
                {isInactive ? 'Activate' : 'Deactivate'} Selected
              </Button>
            </>
          )}
          {children}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedTasks.length === tasks.length && tasks.length > 0}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Total Bidders</TableHead>
              <TableHead>Submissions</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No tasks available
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task: Task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedTasks.includes(task.id)}
                      onCheckedChange={(checked) => handleSelectTask(task.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell className="capitalize">{task.category}</TableCell>
                  <TableCell>{task.bidders.length}/10</TableCell>
                  <TableCell>{task.submissions.length}</TableCell>
                  <TableCell>
                    <TaskStatusBadge status={task.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};