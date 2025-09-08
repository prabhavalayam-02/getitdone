import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/layout/Navbar';
import TaskCard from '@/components/ui/TaskCard';
import { tasksAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, AlertCircle } from 'lucide-react';

const AvailableTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [helperStatus] = useState<'approved' | 'pending'>('approved');
  const { toast } = useToast();
  const userName = localStorage.getItem('userName') || 'Helper';

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery, categoryFilter]);

  const loadTasks = async () => {
    try {
      const availableTasks = await tasksAPI.getTasks({ status: 'open' });
      setTasks(availableTasks);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load available tasks",
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
        task.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(task => task.category === categoryFilter);
    }

    setFilteredTasks(filtered);
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
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast({
        title: "Task accepted",
        description: "You have successfully accepted this task. Check 'My Tasks' to manage it.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to accept task",
      });
    }
  };

  const categories = Array.from(new Set(tasks.map(task => task.category))).sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar role="helper" />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading available tasks...</p>
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Available Tasks</h1>
          <p className="text-muted-foreground">
            Find and accept tasks to start earning money in your community.
          </p>
        </div>

        {/* Helper Status Warning */}
        {helperStatus === 'pending' && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50 animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <h3 className="font-medium text-yellow-800">Account Pending Approval</h3>
                  <p className="text-sm text-yellow-700">
                    You can browse tasks but cannot accept them until your helper account is approved.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks by title, description, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories ({tasks.length})</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category} ({tasks.filter(task => task.category === category).length})
                      </SelectItem>
                    ))}
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
                    <Search className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-foreground mb-2">No available tasks</h3>
                    <p className="text-muted-foreground">
                      Check back later for new tasks to work on.
                    </p>
                  </>
                ) : (
                  <>
                    <Search className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-foreground mb-2">No tasks match your filters</h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your search or filter criteria.
                    </p>
                    <button
                      onClick={() => { setSearchQuery(''); setCategoryFilter('all'); }}
                      className="text-primary hover:underline"
                    >
                      Clear all filters
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
                  onAccept={handleAcceptTask}
                />
              ))}
            </div>
          )}
        </div>

        {/* Summary Info */}
        {tasks.length > 0 && (
          <Card className="mt-8 animate-fade-in">
            <CardHeader>
              <CardTitle>Task Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-foreground">{tasks.length}</p>
                  <p className="text-sm text-muted-foreground">Total Available</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    ${tasks.reduce((sum, task) => sum + task.budget, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    ${Math.round(tasks.reduce((sum, task) => sum + task.budget, 0) / tasks.length)}
                  </p>
                  <p className="text-sm text-muted-foreground">Average Budget</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{categories.length}</p>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AvailableTasksPage;