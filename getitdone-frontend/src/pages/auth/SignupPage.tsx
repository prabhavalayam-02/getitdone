import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { authAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, UserCheck } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import FileUploader from '@/components/ui/FileUploader';

const SignupPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    role: searchParams.get('role') || '',
  });
  
  const [kycFiles, setKycFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match.",
      });
      return;
    }
    
    if (formData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password must be at least 6 characters long.",
      });
      return;
    }

    setLoading(true);
    try {
      // Create FormData to handle file uploads
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      data.append('password', formData.password);
      data.append('role', formData.role);
      
      // Add KYC files if helper role
      if (formData.role === 'helper' && kycFiles.length > 0) {
        kycFiles.forEach((file) => {
          data.append('kycDocs', file);
        });
      }

      const response = await authAPI.signupWithFiles(data);
      
      localStorage.setItem('jwt', response.token);
      localStorage.setItem('userRole', response.user.role);
      localStorage.setItem('userName', response.user.name);
      localStorage.setItem('userId', response.user.id);
      if (response.user.helperStatus) {
        localStorage.setItem('helperStatus', response.user.helperStatus);
      }
      
      toast({
        title: "Account created successfully",
        description: formData.role === 'helper' 
          ? "Your helper account is pending approval. You can still use the platform as a user."
          : "Welcome to GetItDone!",
      });
      
      navigate(`/${formData.role}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Failed to create account",
      });
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'user', label: 'User - I need help with tasks', icon: User },
    { value: 'helper', label: 'Helper - I want to help others', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <Card className="w-full max-w-lg shadow-soft animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Join GetItDone</CardTitle>
            <p className="text-muted-foreground">Create your account to get started</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="123 Main St, City, State"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="role">Role *</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center">
                            <Icon className="h-4 w-4 mr-2" />
                            {option.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              {formData.role === 'helper' && (
                <div>
                  <Label>KYC Documents (Optional)</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload identity documents for faster approval
                  </p>
                  <FileUploader
                    multiple={true}
                    acceptedTypes={['image/*', '.pdf']}
                    maxFiles={3}
                    onFilesChange={setKycFiles}
                  />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                variant="hero"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Create Account
              </Button>
              
              <div className="text-center text-sm">
                <p className="text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/auth/login" className="text-primary hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;