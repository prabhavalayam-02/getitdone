import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Navbar from '@/components/layout/Navbar';
import { adminAPI, tasksAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Users, CheckCircle, Clock, List, Trash2, UserCheck, UserX } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [pendingHelpers, setPendingHelpers] = useState([]);
  const [approvedHelpers, setApprovedHelpers] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending-helpers');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pending, approved, tasks] = await Promise.all([
        adminAPI.getPendingHelpers(),
        adminAPI.getApprovedHelpers(),
        tasksAPI.getTasks(),
      ]);
      
      setPendingHelpers(pending);
      setApprovedHelpers(approved);
      setAllTasks(tasks);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load admin data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveHelper = async (helperId: string) => {
    try {
      await adminAPI.approveHelper(helperId);
      await loadData();
      toast({
        title: "Helper approved",
        description: "Helper has been approved and can now accept tasks.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve helper",
      });
    }
  };

  const handleRejectHelper = async (helperId: string) => {
    try {
      await adminAPI.rejectHelper(helperId);
      await loadData();
      toast({
        title: "Helper rejected",
        description: "Helper application has been rejected.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject helper",
      });
    }
  };

  const handleRevokeApproval = async (helperId: string) => {
    try {
      await adminAPI.revokeHelperApproval(helperId);
      await loadData();
      toast({
        title: "Approval revoked",
        description: "Helper approval has been revoked.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to revoke approval",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await tasksAPI.deleteTask(taskId);
      await loadData();
      toast({
        title: "Task deleted",
        description: "Task has been successfully deleted.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete task",
      });
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar role="admin" />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const renderPendingHelpers = () => (
    <Card>
      <CardHeader>
        <CardTitle>Pending Helper Applications</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingHelpers.length === 0 ? (
          <div className="text-center py-8">
            <UserCheck className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No pending applications</h3>
            <p className="text-muted-foreground">All helper applications have been processed.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>KYC Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingHelpers.map((helper) => (
                <TableRow key={helper.id}>
                  <TableCell className="font-medium">{helper.name}</TableCell>
                  <TableCell>{helper.email}</TableCell>
                  <TableCell>{helper.phone || 'Not provided'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">KYC Uploaded</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleApproveHelper(helper.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectHelper(helper.id)}
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );

  const renderApprovedHelpers = () => (
    <Card>
      <CardHeader>
        <CardTitle>Approved Helpers</CardTitle>
      </CardHeader>
      <CardContent>
        {approvedHelpers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No approved helpers</h3>
            <p className="text-muted-foreground">No helpers have been approved yet.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvedHelpers.map((helper) => (
                <TableRow key={helper.id}>
                  <TableCell className="font-medium">{helper.name}</TableCell>
                  <TableCell>{helper.email}</TableCell>
                  <TableCell>{helper.phone || 'Not provided'}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Approved</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => handleRevokeApproval(helper.id)}
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );

  const renderAllTasks = () => (
    <Card>
      <CardHeader>
        <CardTitle>All Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {allTasks.length === 0 ? (
          <div className="text-center py-8">
            <List className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No tasks found</h3>
            <p className="text-muted-foreground">No tasks have been created yet.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Accepted By</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <Badge className={getTaskStatusColor(task.status)}>
                      {task.status.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{task.createdBy}</TableCell>
                  <TableCell>{task.acceptedBy || 'Not assigned'}</TableCell>
                  <TableCell>${task.budget}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="admin" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage helpers, tasks, and platform operations.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Helpers</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingHelpers.length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved Helpers</p>
                  <p className="text-2xl font-bold text-green-600">{approvedHelpers.length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                  <p className="text-2xl font-bold text-primary">{allTasks.length}</p>
                </div>
                <List className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Tasks</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {allTasks.filter(task => task.status !== 'completed').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === 'pending-helpers' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('pending-helpers')}
          >
            Pending Helpers ({pendingHelpers.length})
          </Button>
          <Button
            variant={activeTab === 'approved-helpers' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('approved-helpers')}
          >
            Approved Helpers ({approvedHelpers.length})
          </Button>
          <Button
            variant={activeTab === 'all-tasks' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('all-tasks')}
          >
            All Tasks ({allTasks.length})
          </Button>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'pending-helpers' && renderPendingHelpers()}
          {activeTab === 'approved-helpers' && renderApprovedHelpers()}
          {activeTab === 'all-tasks' && renderAllTasks()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;