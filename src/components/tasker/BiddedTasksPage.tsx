import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Sidebar from "../Sidebar";
import { Task } from "@/types/task";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../ui/loading-spinner";

const BiddedTasksPage = () => {
  const navigate = useNavigate();

  const { data: userTasks = [], isLoading } = useQuery({
    queryKey: ['user-bidded-tasks'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: tasks, error } = await supabase
        .from('tasks')
        .select(`
          *,
          task_bidders!inner(bidder_id),
          task_submissions(
            status,
            bidder_id
          )
        `)
        .eq('task_bidders.bidder_id', user.id);

      if (error) throw error;

      return tasks.map((task: any) => ({
        ...task,
        submission: task.task_submissions?.find(
          (s: any) => s.bidder_id === user.id
        )
      }));
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const readyForSubmission = userTasks.filter((task: any) => !task.submission);
  const submitted = userTasks.filter((task: any) => task.submission);

  return (
    <Sidebar>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Tasks</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Ready for Submission ({readyForSubmission.length})</h2>
            <div className="space-y-4">
              {readyForSubmission.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No tasks ready for submission</p>
              ) : (
                readyForSubmission.map((task: Task) => (
                  <Card key={task.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg">{task.title}</h3>
                            <p className="text-sm text-gray-600">{task.code}</p>
                            <p className="text-sm text-gray-700">{task.description}</p>
                          </div>
                          <div className="space-y-2 text-right">
                            <Badge variant="outline">
                              Deadline: {format(new Date(task.deadline!), "MMM d, yyyy")}
                            </Badge>
                            <div>
                              <Button 
                                size="sm"
                                onClick={() => navigate(`/tasker/submit/${task.id}`)}
                              >
                                Submit Work
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Submitted Tasks ({submitted.length})</h2>
            <div className="space-y-4">
              {submitted.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No submitted tasks</p>
              ) : (
                submitted.map((task: Task) => (
                  <Card key={task.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg">{task.title}</h3>
                            <p className="text-sm text-gray-600">{task.code}</p>
                            <p className="text-sm text-gray-700">{task.description}</p>
                          </div>
                          <div>
                            <Badge 
                              variant={task.submission?.status === 'approved' ? 'success' : 
                                     task.submission?.status === 'rejected' ? 'destructive' : 
                                     'secondary'}
                            >
                              {task.submission?.status === 'approved' ? 'Approved' :
                               task.submission?.status === 'rejected' ? 'Rejected' :
                               'Pending Review'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </Sidebar>
  );
};

export default BiddedTasksPage;