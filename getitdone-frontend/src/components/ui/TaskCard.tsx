import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, DollarSign, User, Trash2, Play, CheckCircle } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  description: string;
  location: string;
  budget: number;
  category: string;
  date: string;
  status: 'open' | 'accepted' | 'in-progress' | 'completed';
  createdBy?: string;
  acceptedBy?: string;
}

interface TaskCardProps {
  task: Task;
  userRole: 'user' | 'helper' | 'admin';
  onDelete?: (taskId: string) => void;
  onAccept?: (taskId: string) => void;
  onStart?: (taskId: string) => void;
  onComplete?: (taskId: string) => void;
  showActions?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  userRole,
  onDelete,
  onAccept,
  onStart,
  onComplete,
  showActions = true,
}) => {
  const getStatusColor = (status: string) => {
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

  const renderActions = () => {
    if (!showActions) return null;

    switch (userRole) {
      case 'user':
        return task.status === 'open' ? (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete?.(task.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        ) : null;
        
      case 'helper':
        if (task.status === 'open') {
          return (
            <Button 
              variant="hero" 
              size="sm" 
              onClick={() => onAccept?.(task.id)}
            >
              Accept Task
            </Button>
          );
        } else if (task.status === 'accepted') {
          return (
            <Button 
              variant="success" 
              size="sm" 
              onClick={() => onStart?.(task.id)}
            >
              <Play className="h-4 w-4 mr-1" />
              Start Task
            </Button>
          );
        } else if (task.status === 'in-progress') {
          return (
            <Button 
              variant="success" 
              size="sm" 
              onClick={() => onComplete?.(task.id)}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete
            </Button>
          );
        }
        return null;
        
      case 'admin':
        return (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete?.(task.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        );
        
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-soft transition-smooth animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-foreground">
            {task.title}
          </CardTitle>
          <Badge className={getStatusColor(task.status)}>
            {task.status.replace('-', ' ')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{task.description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            {task.location}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(task.date).toLocaleDateString()}
          </div>
          <div className="flex items-center text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-2" />
            ${task.budget}
          </div>
          <div className="flex items-center text-muted-foreground">
            <User className="h-4 w-4 mr-2" />
            {task.category}
          </div>
        </div>
        
        {(task.createdBy || task.acceptedBy) && (
          <div className="text-sm text-muted-foreground">
            {task.createdBy && <p>Created by: {task.createdBy}</p>}
            {task.acceptedBy && <p>Accepted by: {task.acceptedBy}</p>}
          </div>
        )}
        
        <div className="flex justify-end pt-2">
          {renderActions()}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;