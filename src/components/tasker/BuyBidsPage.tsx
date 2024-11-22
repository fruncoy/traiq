import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const BuyBidsPage = () => {
  const currentTasker = JSON.parse(sessionStorage.getItem('currentTasker') || '{}');

  const bidPackages = [
    { bids: 50, amount: 5, popular: false },
    { bids: 100, amount: 9, popular: true },
    { bids: 200, amount: 17, popular: false },
    { bids: 500, amount: 40, popular: false },
  ];

  const { data: currentBids = 0 } = useQuery({
    queryKey: ['user-bids', currentTasker.id],
    queryFn: async () => {
      if (!currentTasker.id) return 0;
      const taskers = JSON.parse(localStorage.getItem('taskers') || '[]');
      const tasker = taskers.find((t: any) => t.id === currentTasker.id);
      return tasker?.bids || 0;
    },
    refetchInterval: 1000
  });

  const purchaseMutation = useMutation({
    mutationFn: async ({ bids, amount }: { bids: number; amount: number }) => {
      if (!currentTasker.id) {
        throw new Error("No tasker logged in");
      }

      // Update taskers array first
      const taskers = JSON.parse(localStorage.getItem('taskers') || '[]');
      const updatedTaskers = taskers.map((t: any) => {
        if (t.id === currentTasker.id) {
          return {
            ...t,
            bids: t.bids + bids
          };
        }
        return t;
      });
      localStorage.setItem('taskers', JSON.stringify(updatedTaskers));

      // Update current tasker in sessionStorage
      const updatedCurrentTasker = {
        ...currentTasker,
        bids: currentTasker.bids + bids
      };
      sessionStorage.setItem('currentTasker', JSON.stringify(updatedCurrentTasker));

      return { success: true };
    },
    onSuccess: () => {
      toast.success("Bids purchased successfully!");
    },
    onError: () => {
      toast.error("Failed to purchase bids. Please try again.");
    }
  });

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Buy Bids</h1>
        <p className="text-gray-600">Current Bids: {currentBids}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {bidPackages.map((pkg) => (
          <Card key={pkg.bids} className={`relative ${pkg.popular ? 'border-blue-500' : ''}`}>
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-center">{pkg.bids} Bids</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <p className="text-2xl font-bold">${pkg.amount}</p>
                <p className="text-sm text-gray-500">
                  ${(pkg.amount / pkg.bids).toFixed(2)} per bid
                </p>
              </div>
              <Button
                className="w-full"
                onClick={() => purchaseMutation.mutate({ bids: pkg.bids, amount: pkg.amount })}
                disabled={purchaseMutation.isPending}
              >
                {purchaseMutation.isPending ? 'Processing...' : 'Purchase'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BuyBidsPage;