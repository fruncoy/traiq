import Sidebar from "../components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Bid {
  id: string;
  taskTitle: string;
  bidders: number;
  timeLeft: string;
  status: "active" | "closed";
}

const bids: Bid[] = [
  {
    id: "1",
    taskTitle: "Translate Short Stories",
    bidders: 5,
    timeLeft: "2 hours",
    status: "active"
  },
  {
    id: "2",
    taskTitle: "Cultural Essays",
    bidders: 8,
    timeLeft: "1 hour",
    status: "active"
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

          <div className="grid gap-4">
            {bids.map((bid) => (
              <Card key={bid.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{bid.taskTitle}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Total Bidders: {bid.bidders}
                      </p>
                      <p className="text-sm text-gray-600">
                        Time Left: {bid.timeLeft}
                      </p>
                    </div>
                    <Badge variant={bid.status === "active" ? "default" : "secondary"}>
                      {bid.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

export default AdminBidding;