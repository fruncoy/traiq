import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/types/task";
import { useState } from "react";
import { TaskActions } from "./TaskActions";
import { TaskTable } from "./TaskTable";

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
        <TaskActions 
          selectedTasks={selectedTasks}
          isInactive={isInactive}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        >
          {children}
        </TaskActions>
      </CardHeader>
      <CardContent>
        <TaskTable 
          tasks={tasks}
          selectedTasks={selectedTasks}
          onSelectAll={handleSelectAll}
          onSelectTask={handleSelectTask}
        />
      </CardContent>
    </Card>
  );
};