import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/layout/Navbar';
import TaskCard from '@/components/ui/TaskCard';
import { tasksAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const userName = localStorage.getItem('userName') || 'User';

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery, statusFilter]);

  const loadTasks = async () => {
    try {
      const userTasks = await tasksAPI.getTasks({ createdBy: userName });
      setTasks(userTasks);
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

  const filterTasks = () => {
    let filtered = [...tasks];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    setFilteredTasks(filtered);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await tasksAPI.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete task",
      });
    }
  };

  const getStatusCounts = () => {
    return {
      all: tasks.length,
      open: tasks.filter(task => task.status === 'open').length,
      accepted: tasks.filter(task => task.status === 'accepted').length,
      'in-progress': tasks.filter(task => task.status === 'in-progress').length,
      completed: tasks.filter(task => task.status === 'completed').length,
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar role="user" />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="user" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Tasks</h1>
            <p className="text-muted-foreground">
              Manage and track all your posted tasks
            </p>
          </div>
          <Link to="/user/create-task">
            <Button variant="hero">
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-6 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks by title, description, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks ({statusCounts.all})</SelectItem>
                    <SelectItem value="open">Open ({statusCounts.open})</SelectItem>
                    <SelectItem value="accepted">Accepted ({statusCounts.accepted})</SelectItem>
                    <SelectItem value="in-progress">In Progress ({statusCounts['in-progress']})</SelectItem>
                    <SelectItem value="completed">Completed ({statusCounts.completed})</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                    <Plus className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-foreground mb-2">No tasks yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Create your first task to get started with GetItDone
                    </p>
                    <Link to="/user/create-task">
                      <Button variant="hero">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Task
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Search className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-foreground mb-2">No tasks found</h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your search or filter criteria
                    </p>
                    <Button variant="outline" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>
                      Clear Filters
                    </Button>
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
                  userRole="user"
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {tasks.length > 0 && (
          <Card className="mt-8 animate-fade-in">
            <CardHeader>
              <CardTitle>Task Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-foreground">{statusCounts.all}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{statusCounts.open}</p>
                  <p className="text-sm text-muted-foreground">Open</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{statusCounts.accepted}</p>
                  <p className="text-sm text-muted-foreground">Accepted</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{statusCounts['in-progress']}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{statusCounts.completed}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyTasksPage;