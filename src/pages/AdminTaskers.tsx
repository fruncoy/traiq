import Sidebar from "../components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { supabase } from "@/integrations/supabase/client";

const AdminTaskers = () => {
  const { data: taskers = [], isLoading } = useQuery({
    queryKey: ['admin-taskers'],
    queryFn: async () => {
      // Fetch profiles with their related task submissions
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          *,
          task_submissions(
            status,
            task_id
          )
        `);

      if (error) throw error;

      return profiles.map((profile: any) => {
        const completedTasks = profile.task_submissions?.filter(
          (s: any) => s.status === 'approved'
        ).length || 0;

        return {
          ...profile,
          completedTasks,
        };
      });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#1E40AF] mb-6">Taskers Management</h2>
          <Card>
            <CardContent className="p-0">
              {taskers.length === 0 ? (
                <p className="text-center text-gray-500 p-4">No taskers found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Completed Tasks</TableHead>
                      <TableHead>Available Bids</TableHead>
                      <TableHead>Total Payouts</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taskers.map((tasker: any) => (
                      <TableRow key={tasker.id}>
                        <TableCell>{tasker.username || 'N/A'}</TableCell>
                        <TableCell>{tasker.email || 'N/A'}</TableCell>
                        <TableCell>{tasker.completedTasks}</TableCell>
                        <TableCell>{tasker.bids || 0}</TableCell>
                        <TableCell>KES {tasker.total_payouts || 0}</TableCell>
                        <TableCell>
                          {new Date(tasker.join_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            tasker.is_suspended 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {tasker.is_suspended ? 'Suspended' : 'Active'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </Sidebar>
    </div>
  );
};

export default AdminTaskers;