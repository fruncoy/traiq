import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export interface Task {
  id: string;
  title: string;
  description: string;
  payout: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  status: "Pending" | "In Progress" | "Completed";
  submittedBy: string;
  submittedAt: string;
}

const tasks: Task[] = [
  {
    id: "1",
    title: "Translate Short Stories",
    description: "Translate 500 words into Swahili, Luhya, Kisii, Dholuo, Kikuyu, Kalenjin, or Maasai",
    payout: 2000,
    difficulty: "Intermediate",
    status: "Pending",
    submittedBy: "John Doe",
    submittedAt: "2024-02-20"
  },
  {
    id: "2",
    title: "Cultural Essays",
    description: "Write 700 words on a traditional ceremony in Swahili or Dholuo",
    payout: 3000,
    difficulty: "Advanced",
    status: "In Progress",
    submittedBy: "Jane Smith",
    submittedAt: "2024-02-19"
  },
  {
    id: "3",
    title: "Language Assessment",
    description: "Review and grade 10 Swahili language assessments",
    payout: 1500,
    difficulty: "Beginner",
    status: "Completed",
    submittedBy: "Mike Johnson",
    submittedAt: "2024-02-18"
  }
];

const TaskList = () => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="available">
        <TabsList className="mb-4">
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="available">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
                <Badge
                  variant={
                    task.status === "Completed" ? "default" :
                    task.status === "In Progress" ? "secondary" : "outline"
                  }
                >
                  {task.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Submitted by: {task.submittedBy}</p>
                      <p className="text-sm text-gray-500">Date: {task.submittedAt}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge
                        variant={
                          task.difficulty === "Beginner" ? "secondary" :
                          task.difficulty === "Intermediate" ? "default" : "destructive"
                        }
                      >
                        {task.difficulty}
                      </Badge>
                      <span className="font-semibold text-primary">Ksh {task.payout}</span>
                      <Button size="sm">
                        Place Bid
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="active">
          {/* Active tasks content */}
        </TabsContent>

        <TabsContent value="completed">
          {/* Completed tasks content */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskList;
