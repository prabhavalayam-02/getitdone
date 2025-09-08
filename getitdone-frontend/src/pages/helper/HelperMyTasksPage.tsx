import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import TaskCard from '@/components/ui/TaskCard';
import { tasksAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Clock, Play, Filter } from 'lucide-react';

const HelperMyTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const userName = localStorage.getItem('userName') || 'Helper';

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, statusFilter]);

  const loadTasks = async () => {
    try {
      const myTasks = await tasksAPI.getTasks({ acceptedBy: userName });
      setTasks(myTasks);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your tasks",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = [...tasks];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    setFilteredTasks(filtered);
  };

  const handleStartTask = async (taskId: string) => {
    try {
      await tasksAPI.updateTaskStatus(taskId, 'in-progress');
      await loadTasks();
      toast({
        title: "Task started",
        description: "Task status updated to in progress. Good luck!",
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
        description: "Congratulations! The task has been marked as completed.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete task",
      });
    }
  };

  const getStatusCounts = () => {
    return {
      all: tasks.length,
      accepted: tasks.filter(task => task.status === 'accepted').length,
      'in-progress': tasks.filter(task => task.status === 'in-progress').length,
      completed: tasks.filter(task => task.status === 'completed').length,
    };
  };

  const statusCounts = getStatusCounts();

  const getTotalEarnings = () => {
    return tasks
      .filter(task => task.status === 'completed')
      .reduce((sum, task) => sum + task.budget, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar role="helper" />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading your tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="helper" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Tasks</h1>
          <p className="text-muted-foreground">
            Manage and track progress on your accepted tasks.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                  <p className="text-2xl font-bold text-foreground">{statusCounts.all}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-orange-600">{statusCounts['in-progress']}</p>
                </div>
                <Play className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{statusCounts.completed}</p>
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
                  <p className="text-2xl font-bold text-primary">${getTotalEarnings()}</p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Card className="mb-6 animate-fade-in">
          <CardContent className="p-6">
            <div className="w-full md:w-64">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks ({statusCounts.all})</SelectItem>
                  <SelectItem value="accepted">Accepted ({statusCounts.accepted})</SelectItem>
                  <SelectItem value="in-progress">In Progress ({statusCounts['in-progress']})</SelectItem>
                  <SelectItem value="completed">Completed ({statusCounts.completed})</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <div className="animate-fade-in">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                {tasks.length === 0 ? (
                  <>
                    <CheckCircle className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-foreground mb-2">No tasks yet</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't accepted any tasks yet. Browse available tasks to get started.
                    </p>
                    <a
                      href="/helper/available-tasks"
                      className="text-primary hover:underline font-medium"
                    >
                      Browse Available Tasks →
                    </a>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-foreground mb-2">No tasks match your filter</h3>
                    <p className="text-muted-foreground mb-6">
                      Try selecting a different status filter.
                    </p>
                    <button
                      onClick={() => setStatusFilter('all')}
                      className="text-primary hover:underline font-medium"
                    >
                      Show All Tasks
                    </button>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  userRole="helper"
                  onStart={handleStartTask}
                  onComplete={handleCompleteTask}
                />
              ))}
            </div>
          )}
        </div>

        {/* Performance Summary */}
        {tasks.length > 0 && (
          <Card className="mt-8 animate-fade-in">
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{statusCounts.all}</p>
                  <p className="text-sm text-muted-foreground">Total Accepted</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {tasks.length > 0 ? Math.round((statusCounts.completed / statusCounts.all) * 100) : 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">${getTotalEarnings()}</p>
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    ${statusCounts.completed > 0 ? Math.round(getTotalEarnings() / statusCounts.completed) : 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg per Task</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HelperMyTasksPage;