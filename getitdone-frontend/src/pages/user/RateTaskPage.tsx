import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/layout/Navbar';
import { Star, Loader2, CheckCircle } from 'lucide-react';

const RateTaskPage: React.FC = () => {
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
      navigate('/user/my-tasks');
      return;
    }

    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to rate tasks.",
        });
        navigate('/auth/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
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
          navigate('/user/my-tasks');
          return;
        }

        // Check if already rated
        if (data.rating) {
          toast({
            title: "Already Rated",
            description: "You have already rated this task.",
          });
          navigate('/user/my-tasks');
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
      navigate('/user/my-tasks');
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
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/rate`, {
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
        navigate('/user/my-tasks');
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
        <Navbar role="user" />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Loading Task...</h2>
                <p className="text-muted-foreground">Please wait...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="user" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Rate Your Helper
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Task Details */}
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Task: {task?.title}</h3>
                <p className="text-sm text-muted-foreground mb-1">
                  <strong>Budget:</strong> ₹{task?.budget}
                </p>
                {task?.acceptedBy && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Helper:</strong> {task.acceptedBy.name || 'Unknown'}
                  </p>
                )}
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  How would you rate the helper's service? *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-12 w-12 ${
                          star <= (hoverRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {rating === 1 && '⭐ Poor'}
                    {rating === 2 && '⭐⭐ Fair'}
                    {rating === 3 && '⭐⭐⭐ Good'}
                    {rating === 4 && '⭐⭐⭐⭐ Very Good'}
                    {rating === 5 && '⭐⭐⭐⭐⭐ Excellent'}
                  </p>
                )}
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Write your review *
                </label>
                <Textarea
                  placeholder="Share your experience with this helper... What did they do well? Any suggestions for improvement?"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {review.length}/500 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="hero"
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
                  onClick={() => navigate('/user/my-tasks')}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  💡 <strong>Your feedback helps!</strong> Ratings help other users find reliable helpers and help helpers improve their service.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RateTaskPage;
