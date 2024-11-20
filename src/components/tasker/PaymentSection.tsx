import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const PaymentSection = () => {
  const queryClient = useQueryClient();
  const userId = 'current-user-id';
  const [formData, setFormData] = useState({
    mpesaNumber: "+254 700 000000",
    withdrawAmount: ""
  });

  const { data: userEarnings = 0 } = useQuery({
    queryKey: ['user-earnings'],
    queryFn: async () => {
      const earnings = JSON.parse(localStorage.getItem('userEarnings') || '{}');
      return earnings[userId] || 0;
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleWithdraw = () => {
    const amount = Number(formData.withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > userEarnings) {
      toast.error("Insufficient balance");
      return;
    }

    const earnings = JSON.parse(localStorage.getItem('userEarnings') || '{}');
    const history = JSON.parse(localStorage.getItem('earningsHistory') || '{}');
    
    earnings[userId] = userEarnings - amount;
    localStorage.setItem('userEarnings', JSON.stringify(earnings));
    
    history[userId] = (history[userId] || 0) + amount;
    localStorage.setItem('earningsHistory', JSON.stringify(history));

    setFormData(prev => ({ ...prev, withdrawAmount: "" }));
    queryClient.invalidateQueries({ queryKey: ['user-earnings'] });
    queryClient.invalidateQueries({ queryKey: ['total-earned'] });

    toast.success("Withdrawal successful", {
      description: `KES ${amount} has been sent to your M-Pesa number`
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">M-Pesa Number</label>
          <Input 
            type="tel"
            name="mpesaNumber"
            value={formData.mpesaNumber}
            onChange={handleChange}
          />
        </div>
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-4">Withdraw Funds</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Available Balance</span>
              <span className="font-semibold">KES {userEarnings}</span>
            </div>
            <Input 
              type="number"
              name="withdrawAmount"
              value={formData.withdrawAmount}
              onChange={handleChange}
              placeholder="Enter amount to withdraw"
              min="1"
              max={userEarnings}
            />
            <Button 
              onClick={handleWithdraw}
              disabled={!formData.withdrawAmount || Number(formData.withdrawAmount) > userEarnings}
              className="w-full bg-white text-[#1E40AF] border border-[#1E40AF] hover:bg-[#1E40AF] hover:text-white"
            >
              Withdraw to M-Pesa
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSection;