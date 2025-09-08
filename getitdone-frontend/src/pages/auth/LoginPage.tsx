import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, UserCheck, Shield } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (role: 'user' | 'helper' | 'admin') => {
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter both email and password.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(email, password, role);
      
      localStorage.setItem('jwt', response.token);
      localStorage.setItem('userRole', response.user.role);
      localStorage.setItem('userName', response.user.name);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.user.name}!`,
      });
      
      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate(`/${role}`);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
      });
    } finally {
      setLoading(false);
    }
  };

  const loginButtons = [
    {
      role: 'user' as const,
      label: 'Login as User',
      icon: User,
      description: 'I need help with tasks',
      variant: 'hero' as const,
    },
    {
      role: 'helper' as const,
      label: 'Login as Helper',
      icon: UserCheck,
      description: 'I want to help others',
      variant: 'default' as const,
    },
    {
      role: 'admin' as const,
      label: 'Login as Admin',
      icon: Shield,
      description: 'Administrative access',
      variant: 'secondary' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <Card className="w-full max-w-md shadow-soft animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <p className="text-muted-foreground">Sign in to your GetItDone account</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-center">Choose your login type:</p>
              {loginButtons.map((button) => {
                const Icon = button.icon;
                return (
                  <Button
                    key={button.role}
                    variant={button.variant}
                    className="w-full justify-start h-auto p-4"
                    onClick={() => handleLogin(button.role)}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-3 animate-spin" />
                    ) : (
                      <Icon className="h-5 w-5 mr-3" />
                    )}
                    <div className="text-left">
                      <div className="font-medium">{button.label}</div>
                      <div className="text-xs opacity-80">{button.description}</div>
                    </div>
                  </Button>
                );
              })}
            </div>

            <div className="text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/auth/signup" className="text-primary hover:underline">
                  Sign up here
                </Link>
              </p>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg text-xs">
              <p className="font-medium mb-1">Demo Credentials:</p>
              <p>User: user@test.com / password</p>
              <p>Helper: helper@test.com / password</p>
              <p>Admin: admin@test.com / password</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;