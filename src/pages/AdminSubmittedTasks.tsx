import Sidebar from "../components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Task } from "@/types/task";
import { TaskSubmissionHistory } from "@/components/admin/TaskSubmissionHistory";
import { SubmissionActions } from "@/components/admin/SubmissionActions";
import { SubmissionList } from "@/components/admin/SubmissionList";

const AdminSubmittedTasks = () => {
  const [selectedTaskerId, setSelectedTaskerId] = useState<string | null>(null);

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const tasks = localStorage.getItem('tasks');
      return tasks ? JSON.parse(tasks) : [];
    },
    refetchInterval: 1000
  });

  const tasksWithSubmissions = tasks.filter((task: Task) => 
    task.submissions && task.submissions.length > 0
  );

  const totalSubmissions = tasksWithSubmissions.reduce((acc, task) => 
    acc + (task.submissions?.length || 0), 0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin>
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#1E40AF]">
              Task Submissions ({totalSubmissions})
            </h2>
          </div>

          <Card>
            <CardContent className="p-6">
              {tasksWithSubmissions.length === 0 ? (
                <p className="text-center text-gray-500">No submissions yet</p>
              ) : (
                <SubmissionList 
                  tasks={tasksWithSubmissions} 
                  selectedTaskerId={selectedTaskerId}
                  setSelectedTaskerId={setSelectedTaskerId}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </Sidebar>
    </div>
  );
};

export default AdminSubmittedTasks;