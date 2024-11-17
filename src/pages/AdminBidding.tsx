import Sidebar from "../components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface Bid {
  id: string;
  taskId: string;
  taskTitle: string;
  bidder: string;
  amount: number;
  coverLetter: string;
  status: "pending" | "accepted" | "rejected";
  rank: number;
}

const bids: Bid[] = [
  {
    id: "1",
    taskId: "task1",
    taskTitle: "Translate Short Stories",
    bidder: "John Doe",
    amount: 1800,
    coverLetter: "I have experience in translating similar content...",
    status: "pending",
    rank: 1
  },
  {
    id: "2",
    taskId: "task1",
    taskTitle: "Translate Short Stories",
    bidder: "Jane Smith",
    amount: 1900,
    coverLetter: "I am a certified translator with 5 years of experience...",
    status: "pending",
    rank: 2
  }
];

const AdminBidding = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isAdmin>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Bidding Management</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Average Bid Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Ksh 1,850</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Bids</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {bids.map((bid) => (
                <Card key={bid.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold">{bid.taskTitle}</h3>
                        <p className="text-sm text-gray-500">Bidder: {bid.bidder}</p>
                      </div>
                      <Badge variant="outline">Rank #{bid.rank}</Badge>
                    </div>
                    <p className="text-sm mb-4">{bid.coverLetter}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Bid Amount: Ksh {bid.amount}</span>
                      <div className="space-x-2">
                        <Button size="sm" variant="outline" className="text-green-600">
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <ThumbsDown className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </Sidebar>
    </div>
  );
};

export default AdminBidding;