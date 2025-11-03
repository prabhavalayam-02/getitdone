import React, { useState, useEffect } from 'react';
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
import { API_BASE_URL } from '@/lib/config';

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const userId = localStorage.getItem('userId');
  
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
  const [dataLoading, setDataLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserInfo({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          role: data.role || 'user',
          helperStatus: data.helperStatus || null,
        });
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: userInfo.name,
          phone: userInfo.phone,
          address: userInfo.address,
        }),
      });
      
      if (response.ok) {
        localStorage.setItem('userName', userInfo.name);
        
        toast({
          title: "Profile updated",
          description: "Your profile information has been saved successfully.",
        });
        setEditMode(false);
      } else {
        throw new Error('Failed to update profile');
      }
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

            {/* Become a Helper / Role Management */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  {userInfo.helperStatus === 'approved' ? 'Role Management' : 'Become a Helper'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* If not applied yet - Show Become Helper section */}
                {!userInfo.helperStatus && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Want to Earn Money?</h4>
                      <p className="text-sm text-blue-800 mb-3">
                        Become a helper and start accepting tasks! Upload your identity documents to get started.
                      </p>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>✓ Work on your own schedule</li>
                        <li>✓ Choose tasks you want to do</li>
                        <li>✓ Earn money for completed tasks</li>
                      </ul>
                    </div>
                    
                    <div>
                      <Label>Upload KYC Documents *</Label>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">
                        Upload 1-3 identity documents (Aadhar, PAN, Driver's License, etc.)
                      </p>
                      
                      <FileUploader
                        multiple={true}
                        acceptedTypes={['image/*', '.pdf']}
                        maxFiles={3}
                        onFilesChange={setKycFiles}
                      />
                    </div>
                    
                    <Button
                      onClick={handleKYCUpload}
                      disabled={loading || kycFiles.length === 0}
                      variant="hero"
                      className="w-full"
                    >
                      {loading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      Submit Application
                    </Button>
                  </div>
                )}

                {/* If pending - Show waiting message */}
                {userInfo.helperStatus === 'pending' && (
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      {getHelperStatusBadge()}
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-yellow-900 mb-1">Application Under Review</h4>
                          <p className="text-sm text-yellow-800">
                            Your KYC documents are being reviewed by our admin team. You'll receive an update within 1-2 business days.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* If approved - Show switch button */}
                {userInfo.helperStatus === 'approved' && (
                  <div className="space-y-4">
                    <div className="text-center py-2">
                      {getHelperStatusBadge()}
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Shield className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-green-900 mb-1">Helper Status Approved!</h4>
                          <p className="text-sm text-green-800">
                            You can now switch between Tasker and Helper modes anytime. Accept tasks and start earning!
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Button onClick={handleRoleSwitch} variant="hero" size="lg" className="w-full">
                      <RefreshCw className="h-5 w-5 mr-2" />
                      Switch to Helper Mode
                    </Button>
                    
                    <p className="text-xs text-center text-muted-foreground">
                      You can switch back to Tasker mode anytime from the Helper dashboard
                    </p>
                  </div>
                )}

                {/* If rejected - Show reapply option */}
                {userInfo.helperStatus === 'rejected' && (
                  <div className="space-y-4">
                    <div className="text-center py-2">
                      {getHelperStatusBadge()}
                    </div>
                    
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-red-900 mb-1">Application Not Approved</h4>
                          <p className="text-sm text-red-800">
                            Your helper application was not approved. Please upload clearer/valid KYC documents to reapply.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Upload New KYC Documents *</Label>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">
                        Upload valid identity documents (Aadhar, PAN, Driver's License)
                      </p>
                      
                      <FileUploader
                        multiple={true}
                        acceptedTypes={['image/*', '.pdf']}
                        maxFiles={3}
                        onFilesChange={setKycFiles}
                      />
                    </div>
                    
                    <Button
                      onClick={handleKYCUpload}
                      disabled={loading || kycFiles.length === 0}
                      variant="hero"
                      className="w-full"
                    >
                      {loading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      Reapply as Helper
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;