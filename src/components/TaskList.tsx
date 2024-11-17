import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface Task {
  id: string;
  title: string;
  description: string;
  payout: number;
  workingTime: string;
  bidsNeeded: number;
  datePosted: string;
}

const tasks: Task[] = [
  {
    id: "1",
    title: "Translate Short Stories",
    description: "Translate 500 words into Swahili, Luhya, Kisii, Dholuo, Kikuyu, Kalenjin, or Maasai",
    payout: 2000,
    workingTime: "2 hours",
    bidsNeeded: 2,
    datePosted: "2024-02-20"
  },
  {
    id: "2",
    title: "Cultural Essays",
    description: "Write 700 words on a traditional ceremony in Swahili or Dholuo",
    payout: 3000,
    workingTime: "3 hours",
    bidsNeeded: 3,
    datePosted: "2024-02-19"
  },
  {
    id: "3",
    title: "Language Assessment",
    description: "Review and grade 10 Swahili language assessments",
    payout: 1500,
    workingTime: "1.5 hours",
    bidsNeeded: 1,
    datePosted: "2024-02-18"
  }
];

interface TaskListProps {
  limit?: number;
  showViewMore?: boolean;
}

const TaskList = ({ limit, showViewMore = false }: TaskListProps) => {
  const displayedTasks = limit ? tasks.slice(0, limit) : tasks;

  return (
    <div className="space-y-4">
      {showViewMore && (
        <h2 className="text-xl font-semibold mb-4">Available Tasks</h2>
      )}
      <div className="grid gap-4">
        {displayedTasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} />
                      <span>{task.workingTime}</span>
                    </div>
                    <p className="text-sm text-gray-600">Posted: {task.datePosted}</p>
                    <p className="text-sm text-gray-600">Bids needed: {task.bidsNeeded}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-primary">KES {task.payout}</span>
                    <Button className="text-white">
                      Bid Now
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showViewMore && (
        <div className="flex justify-between items-center mt-6">
          <Link to="/tasker/tasks" className="text-primary hover:underline flex items-center gap-2">
            View all tasks <ArrowRight size={16} />
          </Link>
          <Link to="/tasker/buy-bids" className="text-primary hover:underline flex items-center gap-2">
            Buy more bids <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default TaskList;