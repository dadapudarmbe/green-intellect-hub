
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LoginForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock authentication logic
      if (isLogin) {
        toast({
          title: "Login successful",
          description: "Welcome back to EcoSmartHub!"
        });
      } else {
        toast({
          title: "Account created",
          description: "Your EcoSmartHub account has been created successfully!"
        });
      }
      
      // In a real app, you would store the auth token and redirect the user
    } catch (error) {
      toast({
        title: isLogin ? "Login failed" : "Registration failed",
        description: "Please check your credentials and try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <motion.div
        className="glass-panel rounded-xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-muted-foreground">
            {isLogin 
              ? 'Sign in to your EcoSmartHub account' 
              : 'Join EcoSmartHub and start your sustainability journey'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Enter your name"
                className="w-full px-4 py-2 rounded-lg border bg-card text-card-foreground"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg border bg-card text-card-foreground"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-2 pr-10 rounded-lg border bg-card text-card-foreground"
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          {isLogin && (
            <div className="text-right">
              <button type="button" className="text-sm text-primary hover:underline">
                Forgot password?
              </button>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 mt-6 px-4 py-2 bg-primary rounded-lg text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            {isLoading ? (
              <div className="h-5 w-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
            ) : isLogin ? (
              <>
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline font-medium"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
