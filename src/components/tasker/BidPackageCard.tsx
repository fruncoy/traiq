import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BidPackage } from "./types/bidPackages";

interface BidPackageCardProps {
  pkg: BidPackage;
  onBuy: (pkg: BidPackage) => void;
  isProcessing: boolean;
}

const BidPackageCard = ({ pkg, onBuy, isProcessing }: BidPackageCardProps) => {
  return (
    <Card className={pkg.popular ? "border-primary" : ""}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{pkg.name}</CardTitle>
          {pkg.popular && (
            <Badge variant="secondary">Popular</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-3xl font-bold">
              {pkg.bids} {pkg.bids === 1 ? "Bid" : "Bids"}
            </div>
            <div className="text-sm text-gray-500">
              KES {pkg.price}
            </div>
          </div>
          <Button 
            className="w-full"
            onClick={() => onBuy(pkg)}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Buy Now"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BidPackageCard;