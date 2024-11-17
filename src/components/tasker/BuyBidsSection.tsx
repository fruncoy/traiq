import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BidPackage {
  id: string;
  name: string;
  amount: number;
  price: number;
  popular?: boolean;
}

const bidPackages: BidPackage[] = [
  {
    id: "1",
    name: "Starter Pack",
    amount: 10,
    price: 1000
  },
  {
    id: "2",
    name: "Popular Pack",
    amount: 25,
    price: 2000,
    popular: true
  },
  {
    id: "3",
    name: "Pro Pack",
    amount: 50,
    price: 3500
  }
];

const BuyBidsSection = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">8 Bids</div>
          <p className="text-sm text-gray-500 mt-1">Available for use</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bidPackages.map((pkg) => (
          <Card key={pkg.id} className={pkg.popular ? "border-primary" : ""}>
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
                    {pkg.amount} Bids
                  </div>
                  <div className="text-sm text-gray-500">
                    Ksh {pkg.price}
                  </div>
                </div>
                <Button className="w-full">
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: "2024-02-20", package: "Popular Pack", amount: 25, price: 2000 },
              { date: "2024-02-10", package: "Starter Pack", amount: 10, price: 1000 }
            ].map((transaction, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <div className="font-medium">{transaction.package}</div>
                  <div className="text-sm text-gray-500">{transaction.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">+{transaction.amount} Bids</div>
                  <div className="text-sm text-gray-500">Ksh {transaction.price}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyBidsSection;