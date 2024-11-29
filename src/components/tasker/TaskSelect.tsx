import { Task } from "@/types/task";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskSelectProps {
  tasks: Task[];
  selectedTask: string;
  onSelect: (taskId: string) => void;
}

export const TaskSelect = ({ tasks, selectedTask, onSelect }: TaskSelectProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Task</label>
      <Select value={selectedTask} onValueChange={onSelect}>
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Select a task to submit" />
        </SelectTrigger>
        <SelectContent position="popper" className="w-full max-h-[300px] overflow-y-auto bg-white">
          {tasks.length === 0 ? (
            <SelectItem value="none" disabled>No active tasks</SelectItem>
          ) : (
            tasks.map((task: Task) => (
              <SelectItem 
                key={task.id} 
                value={task.id}
              >
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{task.title}</span>
                  <span className="text-sm text-gray-500">{task.code}</span>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};