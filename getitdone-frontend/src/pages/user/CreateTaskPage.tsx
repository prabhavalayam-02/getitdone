import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/layout/Navbar';
import { tasksAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin, Calendar, DollarSign, Tag } from 'lucide-react';

const CreateTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    budget: '',
    category: '',
    date: '',
  });
  
  const [loading, setLoading] = useState(false);

  const categories = [
    'Home Repair',
    'Plumbing',
    'Electrical',
    'Cleaning',
    'Gardening',
    'Moving',
    'Painting',
    'Furniture Assembly',
    'Pet Care',
    'Tutoring',
    'Delivery',
    'Other',
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.budget || !formData.category) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    if (parseFloat(formData.budget) <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Budget must be greater than 0.",
      });
      return;
    }

    setLoading(true);
    try {
      const newTask = await tasksAPI.createTask({
        title: formData.title,
        description: formData.description,
        location: formData.location || 'Not specified',
        budget: parseFloat(formData.budget),
        category: formData.category,
        date: formData.date || new Date().toISOString(),
      });
      
      toast({
        title: "Task created successfully",
        description: "Your task has been posted and is now visible to helpers.",
      });
      
      navigate('/user/my-tasks');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create task. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="user" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create New Task</h1>
            <p className="text-muted-foreground">
              Tell us what you need help with and we'll connect you with qualified helpers.
            </p>
          </div>

          <Card className="shadow-soft animate-fade-in">
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title" className="flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Task Title *
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="e.g., Fix leaky kitchen faucet"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="mt-1"
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Be specific and clear about what you need done
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="description">
                    Task Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed information about the task, any special requirements, tools needed, etc."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="mt-1 min-h-[120px]"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location" className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="e.g., Downtown area, My home"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="budget" className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Budget (USD) *
                    </Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="150"
                      min="1"
                      step="0.01"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="date" className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Preferred Date
                    </Label>
                    <Input
                      id="date"
                      type="datetime-local"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="mt-1"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Tips for a successful task posting:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Be specific about what needs to be done</li>
                    <li>• Include any special requirements or tools needed</li>
                    <li>• Set a fair budget based on the complexity of the task</li>
                    <li>• Mention if materials are provided or need to be purchased</li>
                  </ul>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/user')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="hero"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    Post Task
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskPage;