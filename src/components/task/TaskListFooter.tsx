import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface TaskListFooterProps {
  showViewMore: boolean;
  isAdmin: boolean;
  tasksExist: boolean;
}

export const TaskListFooter = ({ showViewMore, isAdmin, tasksExist }: TaskListFooterProps) => {
  if (!showViewMore || isAdmin || !tasksExist) return null;

  return (
    <div className="flex justify-between items-center mt-6">
      <Link to="/tasker/bidded-tasks" className="text-[#1E40AF] hover:underline flex items-center gap-2">
        View my bidded tasks <ArrowRight size={16} />
      </Link>
      <Link to="/tasker/buy-bids" className="text-[#1E40AF] hover:underline flex items-center gap-2">
        Buy more bids <ArrowRight size={16} />
      </Link>
    </div>
  );
};