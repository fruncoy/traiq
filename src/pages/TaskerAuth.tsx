import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, Mail, Lock } from "lucide-react";

interface Tasker {
  id: string;
  username: string;
  email: string;
  password: string;
  bids: number;
  tasksCompleted: number;
  totalPayouts: number;
  pendingPayouts: number;
  joinDate: string;
  isSuspended: boolean;
}

const TaskerAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateUniqueId = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `TSK-${timestamp}-${randomStr}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskers = JSON.parse(localStorage.getItem('taskers') || '[]');
    
    if (isLogin) {
      const tasker = taskers.find((t: Tasker) => 
        t.username === formData.username && t.password === formData.password
      );
      
      if (tasker) {
        sessionStorage.setItem('currentTasker', JSON.stringify(tasker));
        toast.success("Successfully logged in!");
        navigate("/tasker");
      } else {
        toast.error("Invalid credentials");
      }
    } else {
      if (taskers.some((t: Tasker) => t.username === formData.username)) {
        toast.error("Username already exists");
        return;
      }

      const newTasker: Tasker = {
        id: generateUniqueId(),
        username: formData.username,
        email: formData.email,
        password: formData.password,
        bids: 0,
        tasksCompleted: 0,
        totalPayouts: 0,
        pendingPayouts: 0,
        joinDate: new Date().toISOString(),
        isSuspended: false
      };
      
      taskers.push(newTasker);
      localStorage.setItem('taskers', JSON.stringify(taskers));
      sessionStorage.setItem('currentTasker', JSON.stringify(newTasker));
      toast.success("Account created successfully!");
      navigate("/tasker");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-600">
            {isLogin ? "Sign in to continue" : "Sign up to get started"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                name="username"
                placeholder="Username"
                required
                value={formData.username}
                onChange={handleChange}
                className="pl-10 h-12 bg-gray-50 border-none shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] rounded-xl"
              />
            </div>

            {!isLogin && (
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 h-12 bg-gray-50 border-none shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] rounded-xl"
                />
              </div>
            )}

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="pl-10 h-12 bg-gray-50 border-none shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] rounded-xl"
              />
            </div>
          </div>

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
                onClick={() => toast.info("Password reset functionality coming soon!")}
              >
                Forgot Password?
              </button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 bg-primary-DEFAULT hover:bg-primary-dark text-white rounded-xl shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff] transition-all duration-200 hover:shadow-[2px_2px_5px_#bebebe,-2px_-2px_5px_#ffffff]"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>

          <div className="text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:underline font-medium"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TaskerAuth;