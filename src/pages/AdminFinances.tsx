import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";

interface Transaction {
  id: string;
  tasker: string;
  amount: number;
  type: "bid_purchase" | "payout";
  totalPayout: number;
  pendingPayout: number;
  date: string;
}

const AdminFinances = () => {
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      return [] as Transaction[];
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Financial Management</h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Total Payouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh 0</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tasker</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Total Payout</TableHead>
                    <TableHead>Pending Payout</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.tasker}</TableCell>
                      <TableCell>Ksh {transaction.amount}</TableCell>
                      <TableCell>
                        {transaction.type === "bid_purchase" ? "Bid Purchase" : "Payout"}
                      </TableCell>
                      <TableCell>Ksh {transaction.totalPayout}</TableCell>
                      <TableCell>Ksh {transaction.pendingPayout}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
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