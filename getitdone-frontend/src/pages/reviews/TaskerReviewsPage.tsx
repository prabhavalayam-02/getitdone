import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/enhanced-button';
import Navbar from '@/components/layout/Navbar';
import { Star, ArrowLeft, User, Calendar, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getApiUrl } from '@/lib/utils/api-url';

interface Review {
  _id: string;
  taskId: string;
  taskTitle: string;
  rating: number;
  review: string;
  reviewerName: string;
  createdAt: string;
}

interface TaskerData {
  name: string;
  email: string;
  rating: number;
  totalRatings: number;
  reviews: Review[];
}

const TaskerReviewsPage: React.FC = () => {
  const { taskerId } = useParams<{ taskerId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [taskerData, setTaskerData] = useState<TaskerData | null>(null);
  const [loading, setLoading] = useState(true);
  const userRole = (localStorage.getItem('userRole') || 'helper') as 'helper' | 'user' | 'admin';

  useEffect(() => {
    fetchTaskerReviews();
  }, [taskerId]);

  const fetchTaskerReviews = async () => {
    try {
      const response = await fetch(getApiUrl(`/api/reviews/tasker/${taskerId}`));
      
      if (response.ok) {
        const data = await response.json();
        setTaskerData(data);
      } else {
        throw new Error('Failed to fetch reviews');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load tasker reviews",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingDistribution = () => {
    if (!taskerData?.reviews || taskerData.reviews.length === 0) return [];
    
    const distribution = [0, 0, 0, 0, 0];
    taskerData.reviews.forEach((review) => {
      distribution[review.rating - 1]++;
    });
    
    return distribution.reverse(); // Show 5 stars first
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar role={userRole} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading tasker profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!taskerData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar role={userRole} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Tasker Not Found</h1>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  const distribution = getRatingDistribution();

  return (
    <div className="min-h-screen bg-background">
      <Navbar role={userRole} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {/* Tasker Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <User className="h-6 w-6" />
                  {taskerData.name}'s Profile
                </div>
                <Badge variant="secondary" className="ml-auto">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Task Owner
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Overall Rating */}
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {taskerData.rating ? taskerData.rating.toFixed(1) : '0.0'}
                  </div>
                  <div className="flex justify-center mb-2">
                    {renderStars(Math.round(taskerData.rating || 0))}
                  </div>
                  <p className="text-muted-foreground">
                    {taskerData.totalRatings || 0} {taskerData.totalRatings === 1 ? 'review' : 'reviews'}
                  </p>
                  {taskerData.totalRatings === 0 && (
                    <Badge variant="secondary" className="mt-2">New Tasker</Badge>
                  )}
                </div>

                {/* Rating Distribution */}
                <div className="md:col-span-2">
                  <h4 className="font-semibold mb-3">Rating Distribution</h4>
                  {taskerData.totalRatings > 0 ? (
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((star, index) => {
                        const count = distribution[index] || 0;
                        const percentage = taskerData.totalRatings 
                          ? (count / taskerData.totalRatings) * 100 
                          : 0;
                        
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-sm w-8">{star} ⭐</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-12 text-right">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No ratings yet</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{taskerData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Reviews</p>
                  <p className="text-2xl font-bold">{taskerData.totalRatings || 0}</p>
                </div>
              </div>

              {taskerData.totalRatings > 0 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>✓ Verified Task Owner</strong> - This tasker has completed {taskerData.totalRatings} {taskerData.totalRatings === 1 ? 'task' : 'tasks'} and received feedback from helpers.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Helper Reviews</h2>
            
            {taskerData.reviews && taskerData.reviews.length > 0 ? (
              taskerData.reviews.map((review) => (
                <Card key={review._id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {renderStars(review.rating)}
                          <span className="font-semibold">{review.rating}.0</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          by {review.reviewerName} (Helper)
                        </p>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    
                    {review.taskTitle && (
                      <Badge variant="secondary" className="mb-3">
                        Task: {review.taskTitle}
                      </Badge>
                    )}
                    
                    <p className="text-foreground">{review.review}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Star className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground">
                    This task owner hasn't received any reviews from helpers yet.
                  </p>
                  {userRole === 'helper' && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Be the first to work with them and leave a review!
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskerReviewsPage;
