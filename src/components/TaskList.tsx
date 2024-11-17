import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Task {
  id: string;
  title: string;
  description: string;
  payout: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

const tasks: Task[] = [
  {
    id: "1",
    title: "Translate Short Stories",
    description: "Translate 500 words into Swahili, Luhya, Kisii, Dholuo, Kikuyu, Kalenjin, or Maasai",
    payout: 2000,
    difficulty: "Intermediate"
  },
  {
    id: "2",
    title: "Cultural Essays",
    description: "Write 700 words on a traditional ceremony in Swahili or Dholuo",
    payout: 3000,
    difficulty: "Advanced"
  },
  // ... Add all other tasks following the same pattern
];

const TaskList = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardHeader>
            <CardTitle className="text-lg">{task.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{task.description}</p>
            <div className="flex justify-between items-center">
              <Badge variant={
                task.difficulty === "Beginner" ? "secondary" :
                task.difficulty === "Intermediate" ? "default" : "destructive"
              }>
                {task.difficulty}
              </Badge>
              <span className="font-semibold text-primary">Ksh {task.payout}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TaskList;