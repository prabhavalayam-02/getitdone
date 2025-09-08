import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/layout/Navbar';
import FileUploader from '@/components/ui/FileUploader';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { User, Upload, Shield, RefreshCw, Save, Star, DollarSign, CheckCircle } from 'lucide-react';

const HelperProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock helper data - in real app this would come from API
  const [helperInfo, setHelperInfo] = useState({
    name: localStorage.getItem('userName') || 'Jane Smith',
    email: 'helper@test.com',
    phone: '+1 234 567 8901',
    address: '456 Oak Ave, City, State',
    role: 'helper',
    helperStatus: 'approved', // 'pending', 'approved', 'rejected'
    bio: 'Experienced handyman with 5+ years in home repairs and maintenance. Specialized in plumbing, electrical work, and general fixes.',
    skills: ['Plumbing', 'Electrical', 'Painting', 'Furniture Assembly'],
    rating: 4.8,
    completedTasks: 23,
    totalEarnings: 1250,
  });
  
  const [newKycFiles, setNewKycFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setHelperInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('userName', helperInfo.name);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
      });
      setEditMode(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKYCUpdate = async () => {
    if (newKycFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "No files selected",
        description: "Please select new KYC documents to upload.",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "KYC documents updated",
        description: "Your KYC documents have been updated successfully.",
      });
      
      setNewKycFiles([]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload KYC documents. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSwitch = () => {
    // Switch to user dashboard
    localStorage.setItem('userRole', 'user');
    navigate('/user');
    toast({
      title: "Switched to User mode",
      description: "You are now viewing your user dashboard.",
    });
  };

  const getHelperStatusBadge = () => {
    switch (helperInfo.helperStatus) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved Helper</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Application Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown Status</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="helper" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground mb-2">Helper Profile</h1>
            <p className="text-muted-foreground">
              Manage your helper profile, skills, and documents.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rating</p>
                    <p className="text-2xl font-bold text-foreground">{helperInfo.rating}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tasks Completed</p>
                    <p className="text-2xl font-bold text-foreground">{helperInfo.completedTasks}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Earned</p>
                    <p className="text-2xl font-bold text-foreground">${helperInfo.totalEarnings}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <div className="mt-1">
                      {getHelperStatusBadge()}
                    </div>
                  </div>
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Personal Information
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditMode(!editMode)}
                    >
                      {editMode ? 'Cancel' : 'Edit'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={helperInfo.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={!editMode}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={helperInfo.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!editMode}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={helperInfo.email}
                      disabled={true}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Contact support to change your email address
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={helperInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!editMode}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      value={helperInfo.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      disabled={!editMode}
                      className="mt-1 min-h-[100px]"
                      placeholder="Describe your experience, specialties, and what makes you a great helper..."
                    />
                  </div>

                  {editMode && (
                    <Button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Skills & Specialties */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Skills & Specialties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {helperInfo.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm">
                    Edit Skills
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Helper Status & KYC */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Helper Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Current Status</Label>
                    <div className="mt-2">
                      {getHelperStatusBadge()}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Update KYC Documents</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Upload new identity documents if needed.
                      </p>
                    </div>
                    
                    <FileUploader
                      multiple={true}
                      acceptedTypes={['image/*', '.pdf']}
                      maxFiles={3}
                      onFilesChange={setNewKycFiles}
                    />
                    
                    <Button
                      onClick={handleKYCUpdate}
                      disabled={loading || newKycFiles.length === 0}
                      variant="outline"
                      className="w-full"
                    >
                      {loading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      Update KYC Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Role Switching */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Role Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    You can switch between helper and user modes to access different features.
                  </p>
                  
                  <Button onClick={handleRoleSwitch} variant="hero" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Switch to User Mode
                  </Button>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Download My Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Privacy Settings
                  </Button>
                  <Button variant="destructive" className="w-full justify-start">
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelperProfilePage;