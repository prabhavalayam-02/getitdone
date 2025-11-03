import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/layout/Navbar';
import FileUploader from '@/components/ui/FileUploader';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, Link } from 'react-router-dom';
import { User, Upload, Shield, RefreshCw, Save, Star, IndianRupee, CheckCircle, AlertCircle, CreditCard } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { userAPI } from '@/lib/api';
import { getApiUrl } from '@/lib/utils/api-url';

const HelperProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [helperInfo, setHelperInfo] = useState({
    name: localStorage.getItem('userName') || '',
    email: '',
    phone: '',
    address: '',
    role: 'helper',
    helperStatus: localStorage.getItem('helperStatus') || 'pending',
    bio: '',
    skills: [],
    rating: 0,
    completedTasks: 0,
    totalEarnings: 0,
  });
  
  const [newKycFiles, setNewKycFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchHelperData();
  }, []);

  const fetchHelperData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('jwt');
      
      const response = await fetch(getApiUrl(`/api/users/${userId}`), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setHelperInfo({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          role: data.role || 'helper',
          helperStatus: data.helperStatus || 'pending',
          bio: data.bio || '',
          skills: data.skills || [],
          rating: data.rating || 0,
          completedTasks: data.completedTasks || 0,
          totalEarnings: data.totalEarnings || 0,
        });
        
        // Update localStorage with latest status
        localStorage.setItem('helperStatus', data.helperStatus);
      }
    } catch (error) {
      console.error('Failed to fetch helper data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setHelperInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }

      await userAPI.updateProfile(userId, {
        name: helperInfo.name,
        phone: helperInfo.phone,
        address: helperInfo.address,
        bio: helperInfo.bio,
        skills: helperInfo.skills,
      });
      
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

    // Check if status is pending
    if (helperInfo.helperStatus === 'pending') {
      toast({
        variant: "destructive",
        title: "Cannot update KYC",
        description: "Your previous KYC submission is pending approval. Please wait for admin review.",
      });
      return;
    }

    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('jwt');
      
      const formData = new FormData();
      newKycFiles.forEach((file) => {
        formData.append('kycDocs', file);
      });

      const response = await fetch(getApiUrl(`/api/helpers/${userId}/kyc`), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "KYC documents updated",
          description: "Your KYC documents have been submitted for review.",
        });
        
        setNewKycFiles([]);
        
        // Update status to pending after re-upload
        setHelperInfo(prev => ({ ...prev, helperStatus: 'pending' }));
        localStorage.setItem('helperStatus', 'pending');
        
        // Refresh data
        await fetchHelperData();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload KYC documents. Please try again.",
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
          <div className="mb-8 animate-fade-in flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Helper Profile</h1>
              <p className="text-muted-foreground">
                Manage your helper profile, skills, and documents.
              </p>
            </div>
            <Link to="/helper/subscription">
              <Button variant="hero" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Manage Subscription
              </Button>
            </Link>
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
                    <p className="text-2xl font-bold text-foreground">₹{helperInfo.totalEarnings}</p>
                  </div>
                  <IndianRupee className="h-8 w-8 text-primary" />
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

                  {helperInfo.helperStatus === 'rejected' && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Your helper application has been rejected. Please upload new KYC documents below to reapply.
                      </AlertDescription>
                    </Alert>
                  )}

                  {helperInfo.helperStatus === 'pending' && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Your KYC documents are under review. You cannot update documents while approval is pending.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Label>Update KYC Documents</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {helperInfo.helperStatus === 'rejected' 
                          ? 'Upload new KYC documents to reapply for helper status.' 
                          : 'Upload new identity documents if needed.'}
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

              {/* Subscription Status */}
              <Card className="animate-fade-in bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    Subscription
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Current Plan</p>
                    <Badge className="bg-blue-100 text-blue-800">Free Trial</Badge>
                    <p className="text-xs text-muted-foreground mt-2">
                      Complete up to 5 tasks for free
                    </p>
                  </div>
                  
                  <div className="bg-white/50 rounded-lg p-3 border border-blue-100">
                    <p className="text-sm font-semibold text-foreground mb-1">
                      Unlock unlimited tasks!
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Upgrade to premium and earn without limits
                    </p>
                    <Link to="/helper/subscription">
                      <Button variant="hero" size="sm" className="w-full">
                        View Plans
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Role Switching */}
              <Card className="animate-fade-in bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-green-600" />
                    Role Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white/60 rounded-lg p-3 border border-green-100">
                    <p className="text-sm text-foreground mb-2">
                      <strong>Current Mode:</strong> Helper
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Switch to Tasker mode to create and manage your own tasks.
                    </p>
                  </div>
                  
                  <Button onClick={handleRoleSwitch} variant="hero" size="lg" className="w-full">
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Switch to Tasker Mode
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    You can switch back to Helper mode anytime
                  </p>
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