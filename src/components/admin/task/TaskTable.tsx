import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/types/task";
import { TaskStatusBadge } from "./TaskStatusBadge";

interface TaskTableProps {
  tasks: Task[];
  selectedTasks: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectTask: (taskId: string, checked: boolean) => void;
}

export const TaskTable = ({ 
  tasks, 
  selectedTasks, 
  onSelectAll, 
  onSelectTask 
}: TaskTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox 
              checked={selectedTasks.length === tasks.length && tasks.length > 0}
              onCheckedChange={(checked) => onSelectAll(checked as boolean)}
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
                  onCheckedChange={(checked) => onSelectTask(task.id, checked as boolean)}
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
  );
};