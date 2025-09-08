import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/layout/Navbar';
import FileUploader from '@/components/ui/FileUploader';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { User, Upload, Shield, RefreshCw, Save, AlertCircle } from 'lucide-react';

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock user data - in real app this would come from API
  const [userInfo, setUserInfo] = useState({
    name: localStorage.getItem('userName') || 'John Doe',
    email: 'user@test.com',
    phone: '+1 234 567 8900',
    address: '123 Main St, City, State',
    role: 'user',
    helperStatus: null, // null, 'pending', 'approved', 'rejected'
  });
  
  const [kycFiles, setKycFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('userName', userInfo.name);
      
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

  const handleKYCUpload = async () => {
    if (kycFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "No files selected",
        description: "Please select KYC documents to upload.",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate file upload and helper role request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUserInfo(prev => ({ ...prev, helperStatus: 'pending' }));
      
      toast({
        title: "KYC documents uploaded",
        description: "Your helper application is now pending review. You'll be notified once approved.",
      });
      
      setKycFiles([]);
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
    if (userInfo.helperStatus === 'approved') {
      // Switch to helper dashboard
      localStorage.setItem('userRole', 'helper');
      navigate('/helper');
      toast({
        title: "Switched to Helper mode",
        description: "You are now viewing your helper dashboard.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Cannot switch roles",
        description: "You need to be an approved helper to switch to helper mode.",
      });
    }
  };

  const getHelperStatusBadge = () => {
    switch (userInfo.helperStatus) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Helper Application Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved Helper</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Helper Application Rejected</Badge>;
      default:
        return <Badge variant="secondary">User Only</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="user" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your account information and helper status.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Profile Information */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profile Information
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
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={userInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!editMode}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={userInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={true} // Email usually can't be changed
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Contact support to change your email address
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={userInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!editMode}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={userInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!editMode}
                    className="mt-1"
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

            {/* Helper Status & Role Management */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Helper Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Current Status</Label>
                  <div className="mt-2">
                    {getHelperStatusBadge()}
                  </div>
                </div>

                {userInfo.helperStatus === 'pending' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Application Under Review</h4>
                        <p className="text-sm text-yellow-700">
                          Your helper application is being reviewed. You'll receive an update within 1-2 business days.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {userInfo.helperStatus === 'approved' && (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-green-600 mr-3" />
                        <div>
                          <h4 className="font-medium text-green-800">Helper Approved!</h4>
                          <p className="text-sm text-green-700">
                            You can now accept tasks and earn money as a helper.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Button onClick={handleRoleSwitch} variant="hero" className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Switch to Helper Dashboard
                    </Button>
                  </div>
                )}

                {userInfo.helperStatus === 'rejected' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                      <div>
                        <h4 className="font-medium text-red-800">Application Rejected</h4>
                        <p className="text-sm text-red-700">
                          Your helper application was not approved. You can reapply by uploading new KYC documents.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {(!userInfo.helperStatus || userInfo.helperStatus === 'rejected') && (
                  <div className="space-y-4">
                    <div>
                      <Label>Apply to Become a Helper</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Upload your identity documents to apply for helper status and start earning money.
                      </p>
                    </div>
                    
                    <FileUploader
                      multiple={true}
                      acceptedTypes={['image/*', '.pdf']}
                      maxFiles={3}
                      onFilesChange={setKycFiles}
                    />
                    
                    <Button
                      onClick={handleKYCUpload}
                      disabled={loading || kycFiles.length === 0}
                      className="w-full"
                    >
                      {loading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      {userInfo.helperStatus === 'rejected' ? 'Reapply as Helper' : 'Apply to Become Helper'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Account Actions */}
          <Card className="mt-8 animate-fade-in">
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline">
                  Change Password
                </Button>
                <Button variant="outline">
                  Download My Data
                </Button>
                <Button variant="destructive">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;