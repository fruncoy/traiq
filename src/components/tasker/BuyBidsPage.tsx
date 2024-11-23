import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Sidebar from "../Sidebar";
import BidsBalance from "./BidsBalance";
import BidPackageCard from "./BidPackageCard";
import CustomBidPackage from "./CustomBidPackage";
import { bidPackages, BidPackage } from "./types/bidPackages";

const BuyBidsPage = () => {
  const [customBids, setCustomBids] = useState<number>(2);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Check authentication
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        throw new Error('Not authenticated');
      }
      return session;
    }
  });
  
  const { data: currentBids = 0 } = useQuery({
    queryKey: ['user-bids', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return 0;
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('bids')
        .eq('id', session.user.id)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') return 0;
        throw error;
      }
      return profile?.bids || 0;
    },
    enabled: !!session?.user?.id
  });

  const purchaseMutation = useMutation({
    mutationFn: async ({ bids, amount }: { bids: number; amount: number }) => {
      if (!session?.user?.id) {
        navigate('/auth');
        throw new Error("Please sign in to purchase bids");
      }

      // Update user's bids in profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          bids: (currentBids || 0) + bids 
        })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      // Record the transaction
      const { error: transactionError } = await supabase
        .from('bid_transactions')
        .insert({
          tasker_id: session.user.id,
          amount: amount
        });

      if (transactionError) throw transactionError;
      
      return { success: true, bids, amount };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-bids'] });
      toast.success(`Successfully purchased ${variables.bids} bids`);
    },
    onError: (error: Error) => {
      toast.error("Failed to process purchase: " + error.message);
    }
  });

  const handleBuyPackage = (pkg: BidPackage) => {
    if (!session) {
      navigate('/auth');
      return;
    }
    purchaseMutation.mutate({ bids: pkg.bids, amount: pkg.price });
  };

  const handleBuyCustom = () => {
    if (!session) {
      navigate('/auth');
      return;
    }
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
        <BidsBalance currentBids={currentBids} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bidPackages.map((pkg) => (
            <BidPackageCard
              key={pkg.id}
              pkg={pkg}
              onBuy={handleBuyPackage}
              isProcessing={purchaseMutation.isPending}
            />
          ))}
        </div>

        <CustomBidPackage
          customBids={customBids}
          onBidsChange={setCustomBids}
          onBuy={handleBuyCustom}
          isProcessing={purchaseMutation.isPending}
        />
      </div>
    </Sidebar>
  );
};

export default BuyBidsPage;