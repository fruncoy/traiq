import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, DollarSign, Globe2, Laptop } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light to-primary-dark">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">TRAIQ</h1>
          <p className="text-xl text-white/90 mb-8">
            Train AI Models in Your Local Language and Earn Money
          </p>
          <Button 
            size="lg"
            className="bg-accent hover:bg-accent-dark text-white px-8 py-6 text-lg"
            onClick={() => navigate("/dashboard")}
          >
            Start Training AI & Earn
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <FeatureCard 
            icon={<DollarSign className="w-8 h-8" />}
            title="Earn Money"
            description="Get paid for completing AI training tasks in your local language"
          />
          <FeatureCard 
            icon={<Globe2 className="w-8 h-8" />}
            title="Local Languages"
            description="Help improve AI understanding of diverse languages and cultures"
          />
          <FeatureCard 
            icon={<Brain className="w-8 h-8" />}
            title="Train AI Models"
            description="Contribute to making AI systems more inclusive and accurate"
          />
          <FeatureCard 
            icon={<Laptop className="w-8 h-8" />}
            title="Flexible Work"
            description="Work from anywhere, anytime at your own pace"
          />
        </div>

        {/* How It Works Section */}
        <div className="text-center text-white mb-16">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">1. Sign Up</h3>
              <p>Create your account and complete your profile</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">2. Select Tasks</h3>
              <p>Choose from available AI training tasks in your language</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">3. Get Paid</h3>
              <p>Complete tasks and earn money for your contributions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <Card className="bg-white/10 border-none">
    <CardContent className="p-6 text-white">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-white/80">{description}</p>
    </CardContent>
  </Card>
);

export default Index;