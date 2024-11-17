import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

interface Bid {
  id: string;
  taskTitle: string;
  bidAmount: number;
  status: "active" | "completed" | "failed";
  submittedAt: string;
}

const BiddingSection = () => {
  const { data: activeBids = [] } = useQuery({
    queryKey: ['active-bids'],
    queryFn: async () => {
      // This would be replaced with actual API call
      return [] as Bid[];
    }
  });

  const { data: previousBids = [] } = useQuery({
    queryKey: ['previous-bids'],
    queryFn: async () => {
      // This would be replaced with actual API call
      return [] as Bid[];
    }
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Available Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBids.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Bids</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeBids.map((bid) => (
              <div key={bid.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{bid.taskTitle}</h3>
                    <p className="text-sm text-gray-500">Submitted: {bid.submittedAt}</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm">
                    <span className="text-gray-500">Bid Amount:</span>
                    <span className="font-semibold ml-2">KES {bid.bidAmount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Previous Bids</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {previousBids.slice(0, 5).map((bid) => (
              <div key={bid.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{bid.taskTitle}</h3>
                    <p className="text-sm text-gray-500">Submitted: {bid.submittedAt}</p>
                  </div>
                  <Badge
                    variant={bid.status === "completed" ? "default" : "destructive"}
                  >
                    {bid.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm">
                    <span className="text-gray-500">Bid Amount:</span>
                    <span className="font-semibold ml-2">KES {bid.bidAmount}</span>
                  </div>
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