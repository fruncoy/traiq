import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const AdminTaskers = () => {
  const { data: taskers = [], isLoading } = useQuery({
    queryKey: ['taskers'],
    queryFn: async () => {
      const taskers = JSON.parse(localStorage.getItem('taskers') || '[]');
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      
      return taskers.map((tasker: any) => {
        const completedTasks = tasks.reduce((count: number, task: any) => {
          const approved = task.submissions?.some(
            (s: any) => s.bidderId === tasker.id && s.status === 'approved'
          );
          return approved ? count + 1 : count;
        }, 0);
        
        const totalPayouts = tasks.reduce((total: number, task: any) => {
          const approved = task.submissions?.some(
            (s: any) => s.bidderId === tasker.id && s.status === 'approved'
          );
          if (approved) {
            return total + (task.category === 'genai' ? 700 : 300);
          }
          return total;
        }, 0);
        
        return {
          ...tasker,
          completedTasks,
          totalPayouts
        };
      });
    },
    refetchInterval: 1000 // Refresh every second
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#1E40AF] mb-6">Taskers Management</h2>
          <Card>
            <CardContent className="p-0">
              {taskers.length === 0 ? (
                <p className="text-center text-gray-500">No taskers found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Completed Tasks</TableHead>
                      <TableHead>Total Payouts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taskers.map(tasker => (
                      <TableRow key={tasker.id}>
                        <TableCell>{tasker.name}</TableCell>
                        <TableCell>{tasker.email}</TableCell>
                        <TableCell>{tasker.completedTasks}</TableCell>
                        <TableCell>KES {tasker.totalPayouts}</TableCell>
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
