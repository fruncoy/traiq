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
import { toast } from "sonner";

const BiddedTasksPage = () => {
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  const { data: userTasks = [], isLoading } = useQuery({
    queryKey: ['user-bidded-tasks', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          task_bidders!inner(bidder_id),
          task_submissions(
            id,
            status,
            bidder_id,
            submitted_at
          )
        `)
        .eq('task_bidders.bidder_id', session.user.id)
        .not('status', 'in', '("expired","archived")');

      if (error) throw error;

      return data.map((task: any) => ({
        ...task,
        currentSubmission: task.task_submissions?.find(
          (s: any) => s.bidder_id === session.user.id
        )
      }));
    },
    enabled: !!session?.user?.id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (userProfile?.suspended_at) {
    return (
      <Sidebar>
        <div className="p-6">
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Account Suspended! </strong>
            <span className="block sm:inline">Your account has been suspended. Please contact support for assistance.</span>
          </div>
        </div>
      </Sidebar>
    );
  }

  const readyForSubmission = userTasks.filter((task) => !task.currentSubmission || task.currentSubmission.status === 'rejected');
  const submitted = userTasks.filter((task) => task.currentSubmission && task.currentSubmission.status !== 'rejected');

  const handleSubmitWork = (taskId: string) => {
    if (!session?.user?.id) {
      toast.error("Please login to submit work");
      return;
    }
    navigate(`/tasker/submit/${taskId}`);
  };

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
                readyForSubmission.map((task) => (
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
                                onClick={() => handleSubmitWork(task.id)}
                                className="bg-[#1E40AF] hover:bg-blue-700 text-white"
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
                submitted.map((task) => (
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
                              variant={task.currentSubmission?.status === 'approved' ? 'default' : 
                                     task.currentSubmission?.status === 'rejected' ? 'destructive' : 
                                     'secondary'}
                              className={task.currentSubmission?.status === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
                            >
                              {task.currentSubmission?.status === 'approved' ? 'Approved' :
                               task.currentSubmission?.status === 'rejected' ? 'Rejected' :
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