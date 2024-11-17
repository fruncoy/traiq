import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, Clock } from "lucide-react";

interface Bid {
  id: string;
  taskTitle: string;
  bidAmount: number;
  position: number;
  status: "pending" | "accepted" | "rejected";
  submittedAt: string;
}

const bids: Bid[] = [
  {
    id: "1",
    taskTitle: "Translate Short Stories",
    bidAmount: 2000,
    position: 2,
    status: "pending",
    submittedAt: "2024-02-20"
  },
  {
    id: "2",
    taskTitle: "Cultural Essays",
    bidAmount: 3000,
    position: 1,
    status: "accepted",
    submittedAt: "2024-02-19"
  }
];

const BiddingSection = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Available Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Bids</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bids.map((bid) => (
              <div key={bid.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{bid.taskTitle}</h3>
                    <p className="text-sm text-gray-500">Submitted: {bid.submittedAt}</p>
                  </div>
                  <Badge
                    variant={
                      bid.status === "accepted" ? "default" :
                      bid.status === "rejected" ? "destructive" : "secondary"
                    }
                  >
                    {bid.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <span className="text-gray-500">Bid Amount:</span>
                      <span className="font-semibold ml-2">Ksh {bid.bidAmount}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Position:</span>
                      <span className="font-semibold ml-2">#{bid.position}</span>
                    </div>
                  </div>
                  {bid.status === "pending" && (
                    <Button size="sm" variant="outline">
                      <ArrowUp className="h-4 w-4 mr-2" />
                      Increase Bid
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiddingSection;