import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Task, TaskSubmission } from "@/types/task";
import { TaskSubmissionsTable } from "@/components/admin/TaskSubmissionsTable";
import { supabase } from "@/integrations/supabase/client";

const AdminSubmittedTasks = () => {
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks-with-submissions'],
    queryFn: async () => {
      const { data: tasksData, error } = await supabase
        .from('tasks')
        .select(`
          *,
          task_submissions (
            *,
            profiles (
              username,
              email
            )
          )
        `)
        .not('task_submissions', 'is', null);

      if (error) throw error;
      
      // Transform the data to match our Task type
      const transformedTasks = tasksData.map((task: any) => ({
        ...task,
        bidders: task.task_bidders || [],
        submissions: task.task_submissions || []
      }));
      
      return transformedTasks as Task[];
    }
  });

  const totalSubmissions = tasks.reduce((acc: number, task: Task) => 
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

          <div className="space-y-6">
            {tasks.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-gray-500">No submissions yet</p>
                </CardContent>
              </Card>
            ) : (
              tasks.map((task) => (
                <Card key={task.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="text-lg">
                      Task: {task.title} (Code: {task.code})
                      <span className="ml-2 text-sm font-normal text-gray-600">
                        {task.submissions?.length} submission{task.submissions?.length !== 1 ? 's' : ''}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <TaskSubmissionsTable task={task} />
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

export default AdminSubmittedTasks;