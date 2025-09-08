import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import TaskCard from '@/components/ui/TaskCard';
import { tasksAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Search, AlertCircle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const HelperDashboard: React.FC = () => {
  const [availableTasks, setAvailableTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const userName = localStorage.getItem('userName') || 'Helper';
  
  // Mock helper status - in real app this would come from API
  const [helperStatus] = useState<'approved' | 'pending'>('approved'); // Switch to 'pending' to test pending state

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const [available, accepted] = await Promise.all([
        tasksAPI.getTasks({ status: 'open' }),
        tasksAPI.getTasks({ acceptedBy: userName }),
      ]);
      
      setAvailableTasks(available);
      setMyTasks(accepted);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load tasks",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTask = async (taskId: string) => {
    if (helperStatus !== 'approved') {
      toast({
        variant: "destructive",
        title: "Account Pending",
        description: "Your helper account is still pending approval. You cannot accept tasks yet.",
      });
      return;
    }

    try {
      await tasksAPI.updateTaskStatus(taskId, 'accepted', userName);
      await loadTasks(); // Refresh tasks
      toast({
        title: "Task accepted",
        description: "You have successfully accepted this task.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to accept task",
      });
    }
  };

  const handleStartTask = async (taskId: string) => {
    try {
      await tasksAPI.updateTaskStatus(taskId, 'in-progress');
      await loadTasks();
      toast({
        title: "Task started",
        description: "Task status updated to in progress.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start task",
      });
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await tasksAPI.updateTaskStatus(taskId, 'completed');
      await loadTasks();
      toast({
        title: "Task completed",
        description: "Great job! The task has been marked as completed.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete task",
      });
    }
  };

  const getTaskStats = () => {
    const accepted = myTasks.filter(task => task.status === 'accepted').length;
    const inProgress = myTasks.filter(task => task.status === 'in-progress').length;
    const completed = myTasks.filter(task => task.status === 'completed').length;
    const totalEarnings = myTasks
      .filter(task => task.status === 'completed')
      .reduce((sum, task) => sum + task.budget, 0);
    
    return { accepted, inProgress, completed, totalEarnings, total: myTasks.length };
  };

  const stats = getTaskStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar role="helper" />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="helper" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome, {userName}!
              </h1>
              <p className="text-muted-foreground">
                Find and complete tasks to earn money in your community.
              </p>
            </div>
            <Badge 
              variant={helperStatus === 'approved' ? 'default' : 'secondary'}
              className={helperStatus === 'approved' ? 'bg-green-600' : 'bg-yellow-600'}
            >
              {helperStatus === 'approved' ? 'Approved Helper' : 'Pending Approval'}
            </Badge>
          </div>
        </div>

        {/* Helper Status Alert */}
        {helperStatus === 'pending' && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50 animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <h3 className="font-medium text-yellow-800">Account Pending Approval</h3>
                  <p className="text-sm text-yellow-700">
                    Your helper account is being reviewed. You can browse tasks but cannot accept them until approved. 
                    You can still use the platform as a regular user.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">My Tasks</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
                <Search className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
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
                  <p className="text-2xl font-bold text-primary">${stats.totalEarnings}</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link to="/helper/available-tasks">
            <Card className="hover:shadow-soft transition-smooth cursor-pointer group animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Browse Available Tasks</h3>
                    <p className="text-sm text-muted-foreground">Find new tasks to work on and earn money</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/helper/my-tasks">
            <Card className="hover:shadow-soft transition-smooth cursor-pointer group animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-smooth">
                    <CheckCircle className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">My Accepted Tasks</h3>
                    <p className="text-sm text-muted-foreground">Manage and update your current tasks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Available Tasks */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Available Tasks
              <Link to="/helper/available-tasks">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {availableTasks.length === 0 ? (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No available tasks</h3>
                <p className="text-muted-foreground">
                  Check back later for new tasks to work on
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {availableTasks.slice(0, 3).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    userRole="helper"
                    onAccept={handleAcceptTask}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelperDashboard;