import { TaskStatus } from "@/types/task";

interface TaskStatusBadgeProps {
  status: TaskStatus | null;
}

export const TaskStatusBadge = ({ status }: TaskStatusBadgeProps) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${
      status === 'inactive' 
        ? 'bg-gray-100 text-gray-800'
        : status === 'pending'
          ? 'bg-yellow-100 text-yellow-800'
          : status === 'expired'
            ? 'bg-red-100 text-red-800'
            : 'bg-green-100 text-green-800'
    }`}>
      {status}
    </span>
  );
};