import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuickActionsProps {
  onAction: (action: string) => void;
}

const QuickActions = ({ onAction }: QuickActionsProps) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => onAction("tasks")}
            className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium">Review Tasks</h3>
            <p className="text-sm text-gray-500">Check pending submissions</p>
          </button>
          <button 
            onClick={() => onAction("bids")}
            className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium">Manage Bids</h3>
            <p className="text-sm text-gray-500">Review and approve bids</p>
          </button>
          <button 
            onClick={() => onAction("payments")}
            className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium">Process Payments</h3>
            <p className="text-sm text-gray-500">Handle pending payouts</p>
          </button>
          <button 
            onClick={() => onAction("taskers")}
            className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium">Tasker Approvals</h3>
            <p className="text-sm text-gray-500">Review new registrations</p>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;