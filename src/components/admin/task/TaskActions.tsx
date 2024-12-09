import { Button } from "@/components/ui/button";
import { UseMutationResult } from "@tanstack/react-query";

interface TaskActionsProps {
  selectedTasks: string[];
  isInactive: boolean;
  onDelete: (taskIds: string[]) => void;
  onToggleStatus: (taskIds: string[], newStatus: 'active' | 'inactive') => void;
  children?: React.ReactNode;
}

export const TaskActions = ({ 
  selectedTasks, 
  isInactive, 
  onDelete, 
  onToggleStatus,
  children 
}: TaskActionsProps) => {
  if (selectedTasks.length === 0) {
    return children ? <div>{children}</div> : null;
  }

  return (
    <div className="flex gap-4">
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
      {children}
    </div>
  );
};