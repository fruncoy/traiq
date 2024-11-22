import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Sidebar from "../Sidebar";

interface BidPackage {
  id: string;
  name: string;
  bids: number;
  price: number;
  popular?: boolean;
}

const bidPackages: BidPackage[] = [
  {
    id: "1",
    name: "Starter",
    bids: 1,
    price: 60
  },
  {
    id: "2",
    name: "Basic",
    bids: 3,
    price: 100,
    popular: true
  },
  {
    id: "3",
    name: "Standard",
    bids: 7,
    price: 200
  },
  {
    id: "4",
    name: "Premium",
    bids: 10,
    price: 400
  }
];

const BuyBidsPage = () => {
  const [customBids, setCustomBids] = useState<number>(2);
  const queryClient = useQueryClient();
  
  const currentTasker = JSON.parse(localStorage.getItem('currentTasker') || '{}');
  
  const { data: currentBids = 0 } = useQuery({
    queryKey: ['user-bids', currentTasker.id],
    queryFn: async () => {
      const taskers = JSON.parse(localStorage.getItem('taskers') || '[]');
      const tasker = taskers.find((t: any) => t.id === currentTasker.id);
      return tasker?.bids || 0;
    }
  });

  const purchaseMutation = useMutation({
    mutationFn: async ({ bids, amount }: { bids: number; amount: number }) => {
      const taskers = JSON.parse(localStorage.getItem('taskers') || '[]');
      const updatedTaskers = taskers.map((t: any) => {
        if (t.id === currentTasker.id) {
          return { ...t, bids: (t.bids || 0) + bids };
        }
        return t;
      });
      
      localStorage.setItem('taskers', JSON.stringify(updatedTaskers));
      
      // Update current tasker
      const updatedCurrentTasker = { ...currentTasker, bids: (currentTasker.bids || 0) + bids };
      localStorage.setItem('currentTasker', JSON.stringify(updatedCurrentTasker));
      
      // Track total spent
      const totalSpent = parseFloat(localStorage.getItem('totalSpent') || '0');
      localStorage.setItem('totalSpent', (totalSpent + amount).toString());
      
      return { success: true, bids, amount };
    },
    onSuccess: (_, variables) => {
      toast.success(`Successfully purchased ${variables.bids} bids`);
      queryClient.invalidateQueries({ queryKey: ['user-bids'] });
    },
    onError: () => {
      toast.error("Failed to process purchase");
    }
  });

  const handleBuyPackage = (pkg: BidPackage) => {
    purchaseMutation.mutate({ bids: pkg.bids, amount: pkg.price });
  };

  const handleBuyCustom = () => {
    if (customBids < 2) {
      toast.error("Minimum 2 bids required for custom package");
      return;
    }
    const amount = customBids * 50;
    purchaseMutation.mutate({ bids: customBids, amount });
  };

  return (
    <Sidebar>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currentBids} Bids</div>
            <p className="text-sm text-gray-500 mt-1">Available for use</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                      {pkg.bids} {pkg.bids === 1 ? "Bid" : "Bids"}
                    </div>
                    <div className="text-sm text-gray-500">
                      KES {pkg.price}
                    </div>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => handleBuyPackage(pkg)}
                    disabled={purchaseMutation.isPending}
                  >
                    {purchaseMutation.isPending ? "Processing..." : "Buy Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
                  onChange={(e) => setCustomBids(Number(e.target.value))}
                  className="w-32"
                />
                <span>Bids at KES 50 each = KES {customBids * 50}</span>
              </div>
              <Button 
                onClick={handleBuyCustom}
                disabled={purchaseMutation.isPending}
              >
                {purchaseMutation.isPending ? "Processing..." : "Buy Custom Package"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
};

export default BuyBidsPage;
