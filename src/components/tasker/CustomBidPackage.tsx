import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CustomBidPackageProps {
  customBids: number;
  onBidsChange: (value: number) => void;
  onBuy: () => void;
  isProcessing: boolean;
}

const CustomBidPackage = ({ 
  customBids, 
  onBidsChange, 
  onBuy, 
  isProcessing 
}: CustomBidPackageProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Package</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="number"
              min={2}
              value={customBids}
              onChange={(e) => onBidsChange(Number(e.target.value))}
              className="w-32"
            />
            <span>Bids at KES 50 each = KES {customBids * 50}</span>
          </div>
          <Button 
            onClick={onBuy}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Buy Custom Package"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomBidPackage;