import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TaskCard from "./TaskCard";
import { EmptyState } from "./EmptyState";
import { Task } from "@/types/task";
import { UseMutationResult } from "@tanstack/react-query";

interface TaskListContentProps {
  tasks: Task[];
  limit?: number;
  currentPage: number;
  ITEMS_PER_PAGE: number;
  handleBidClick: (taskId: string) => void;
  isAdmin?: boolean;
  userBids: number;
  bidMutation: UseMutationResult<any, Error, string>;
}

export const TaskListContent = ({ 
  tasks,
  limit,
  currentPage,
  ITEMS_PER_PAGE,
  handleBidClick,
  isAdmin,
  userBids,
  bidMutation
}: TaskListContentProps) => {
  const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedTasks = limit ? tasks.slice(0, limit) : tasks.slice(startIndex, endIndex);

  if (displayedTasks.length === 0) {
    return (
      <EmptyState
        title="No tasks available"
        description="Check back later for new tasks to work on"
      />
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {displayedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onBid={handleBidClick}
            isAdmin={isAdmin}
            userBids={userBids}
            isPending={bidMutation.isPending}
            hidePayouts={false}
          />
        ))}
      </div>

      {!limit && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
};