import { Link } from "react-router-dom";

interface TaskListHeaderProps {
  showViewMore: boolean;
  userBids: number;
}

export const TaskListHeader = ({ showViewMore, userBids }: TaskListHeaderProps) => {
  if (!showViewMore) return null;
  
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Available Tasks</h2>
      <div className="text-sm text-gray-600">
        Available Bids: <span className="font-semibold">{userBids}</span>
      </div>
    </div>
  );
};