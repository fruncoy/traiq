import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Choose Your Role</h1>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Admin Portal</h2>
                <p className="text-gray-600 mb-6">
                  Manage tasks, review submissions, and oversee tasker activities.
                </p>
                <Button 
                  className="w-full"
                  onClick={() => navigate("/admin")}
                >
                  Enter as Admin
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Tasker Portal</h2>
                <p className="text-gray-600 mb-6">
                  Browse available tasks, submit work, and earn money.
                </p>
                <Button 
                  className="w-full"
                  onClick={() => navigate("/tasker")}
                >
                  Enter as Tasker
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;