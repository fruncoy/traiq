import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";

interface Transaction {
  id: string;
  tasker: string;
  amount: number;
  type: "bid_purchase" | "payout";
  status: "completed" | "pending";
  date: string;
}

const transactions: Transaction[] = [
  {
    id: "1",
    tasker: "John Doe",
    amount: 2000,
    type: "bid_purchase",
    status: "completed",
    date: "2024-02-20"
  },
  {
    id: "2",
    tasker: "Jane Smith",
    amount: 3000,
    type: "bid_purchase",
    status: "completed",
    date: "2024-02-19"
  }
];

const AdminFinances = () => {
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
              <div className="text-2xl font-bold">Ksh 125,000</div>
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
                    <TableHead>Status</TableHead>
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
                      <TableCell>
                        <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
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