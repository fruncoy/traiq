import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { resetSystem } from "@/utils/resetSystem";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const Index = () => {
  const queryClient = useQueryClient();

  const handleReset = () => {
    resetSystem();
    queryClient.invalidateQueries();
    toast.success("System reset successfully", {
      description: "All data has been reset to default state."
    });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Card className="w-[90%] max-w-[500px] shadow-lg">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold text-[#4169E1]">TRAIQ</h1>
            <p className="text-lg text-gray-700 px-4">
              Complete tasks and earn money by training AI in local languages
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                to="/admin"
                className="bg-[#4169E1] text-white px-8 py-3 rounded-md hover:bg-[#3457c9] transition-colors"
              >
                Admin Dashboard
              </Link>
              <Link
                to="/tasker-auth"
                className="bg-[#4169E1] text-white px-8 py-3 rounded-md hover:bg-[#3457c9] transition-colors"
              >
                Tasker Dashboard
              </Link>
            </div>
            <div className="pt-4">
              <Button 
                variant="destructive"
                onClick={handleReset}
                className="w-full sm:w-auto"
              >
                Reset System Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;