import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Task } from "@/types/task";
import { TaskStatusBadge } from "./TaskStatusBadge";

interface TaskListProps {
  tasks: Task[];
  title: string;
  count: number;
  children?: React.ReactNode;
}

export const TaskList = ({ tasks, title, count, children }: TaskListProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title} ({count})</CardTitle>
        {children}
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
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No tasks available
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task: Task) => (
                <TableRow key={task.id}>
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