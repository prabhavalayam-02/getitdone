import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/layout/Navbar';
import { Star, Loader2, CheckCircle } from 'lucide-react';
import { getApiUrl } from '@/lib/utils/api-url';

const RateTaskerPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [task, setTask] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    if (!taskId) {
      navigate('/helper/my-tasks');
      return;
    }

    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to rate task owners.",
        });
        navigate('/auth/login');
        return;
      }

      const response = await fetch(getApiUrl(`/api/tasks/${taskId}`), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Check if task is completed and can be rated
        if (data.status !== 'completed') {
          toast({
            variant: "destructive",
            title: "Cannot Rate",
            description: "Only completed tasks can be rated.",
          });
          navigate('/helper/my-tasks');
          return;
        }

        // Check if already rated
        if (data.taskerRating) {
          toast({
            title: "Already Rated",
            description: "You have already rated this task owner.",
          });
          navigate('/helper/my-tasks');
          return;
        }

        setTask(data);
      } else {
        throw new Error('Failed to load task');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load task details.",
      });
      navigate('/helper/my-tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      toast({
        variant: "destructive",
        title: "Rating Required",
        description: "Please select a star rating.",
      });
      return;
    }

    if (!review.trim()) {
      toast({
        variant: "destructive",
        title: "Review Required",
        description: "Please write a review.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(getApiUrl(`/api/tasks/${taskId}/rate-tasker`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, review }),
      });

      if (response.ok) {
        toast({
          title: "Rating Submitted!",
          description: "Thank you for your feedback!",
        });
        navigate('/helper/my-tasks');
      } else {
        const data = await response.json();
        throw new Error(data.msg || 'Failed to submit rating');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit rating. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar role="helper" />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="helper" />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-500" />
                Rate Task Owner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Task Details */}
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Task Details</h3>
                <p className="text-sm"><strong>Title:</strong> {task.title}</p>
                <p className="text-sm"><strong>Description:</strong> {task.description}</p>
                <p className="text-sm"><strong>Budget:</strong> ₹{task.budget}</p>
                {task.createdBy && typeof task.createdBy === 'object' && (
                  <p className="text-sm"><strong>Task Owner:</strong> {task.createdBy.name}</p>
                )}
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Rating <span className="text-destructive">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-10 w-10 cursor-pointer transition-colors ${
                        star <= (hoverRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-lg font-medium">
                      {rating}.0
                    </span>
                  )}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Review <span className="text-destructive">*</span>
                </label>
                <Textarea
                  placeholder="Share your experience working with this task owner. Was the task description clear? Were they easy to communicate with? Would you work with them again?"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="min-h-[150px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your honest feedback helps other helpers make informed decisions.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmitRating}
                  disabled={submitting || rating === 0 || !review.trim()}
                  className="flex-1"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit Rating
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/helper/my-tasks')}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RateTaskerPage;
