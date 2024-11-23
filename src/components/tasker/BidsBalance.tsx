import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BidsBalanceProps {
  currentBids: number;
}

const BidsBalance = ({ currentBids }: BidsBalanceProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{currentBids} Bids</div>
        <p className="text-sm text-gray-500 mt-1">Available for use</p>
      </CardContent>
    </Card>
  );
};

export default BidsBalance;