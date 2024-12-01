import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { startOfWeek, endOfWeek, format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

const AdminFinances = () => {
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  
  // Total Revenue from bid purchases for current week
  const { data: totalRevenue = 0 } = useQuery({
    queryKey: ['total-revenue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bid_transactions')
        .select('amount')
        .gte('transaction_date', weekStart.toISOString())
        .lte('transaction_date', weekEnd.toISOString());

      if (error) throw error;
      return data?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0;
    }
  });

  // Calculate approved payouts from task submissions
  const { data: approvedPayouts = 0 } = useQuery({
    queryKey: ['approved-payouts'],
    queryFn: async () => {
      const { data: submissions, error } = await supabase
        .from('task_submissions')
        .select(`
          *,
          tasks (
            category,
            tasker_payout
          )
        `)
        .eq('status', 'approved')
        .gte('submitted_at', weekStart.toISOString())
        .lte('submitted_at', weekEnd.toISOString());

      if (error) throw error;
      
      return submissions?.reduce((sum, submission) => {
        const payout = submission.tasks?.tasker_payout || 0;
        return sum + Number(payout);
      }, 0) || 0;
    }
  });

  // Calculate profit (Total Revenue - Approved Payouts)
  const profit = totalRevenue - approvedPayouts;

  // Get recent payouts with task and tasker details
  const { data: recentPayouts = [] } = useQuery({
    queryKey: ['recent-payouts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('task_submissions')
        .select(`
          id,
          submitted_at,
          tasks (
            code,
            category,
            tasker_payout
          ),
          profiles (
            username,
            email
          )
        `)
        .eq('status', 'approved')
        .order('submitted_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return data.map(submission => ({
        id: submission.id,
        taskCode: submission.tasks?.code,
        tasker: submission.profiles?.username || submission.profiles?.email,
        amount: submission.tasks?.tasker_payout || 0,
        status: 'Approved',
        date: submission.submitted_at
      }));
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin>
        <div className="space-y-6 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#1E40AF]">Financial Management</h2>
            <div className="text-sm text-gray-600">
              Week: {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">KES {totalRevenue}</div>
                <p className="text-sm text-gray-500">From bid purchases this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approved Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">KES {approvedPayouts}</div>
                <p className="text-sm text-gray-500">Total approved task payouts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${profit < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  KES {profit}
                </div>
                <p className="text-sm text-gray-500">Revenue - Approved Payouts</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Payouts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task Code</TableHead>
                    <TableHead>Tasker</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPayouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell>{payout.taskCode}</TableCell>
                      <TableCell>{payout.tasker}</TableCell>
                      <TableCell>KES {payout.amount}</TableCell>
                      <TableCell>{payout.status}</TableCell>
                      <TableCell>{format(new Date(payout.date), 'MMM d, yyyy')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </Sidebar>
    </div>
  );
};

export default AdminFinances;