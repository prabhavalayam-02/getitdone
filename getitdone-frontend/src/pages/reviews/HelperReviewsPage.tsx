import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/enhanced-button';
import Navbar from '@/components/layout/Navbar';
import { Star, ArrowLeft, User, Calendar } from 'lucide-react';
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

interface HelperData {
  name: string;
  email: string;
  rating: number;
  totalRatings: number;
  completedTasks: number;
  reviews: Review[];
}

const HelperReviewsPage: React.FC = () => {
  const { helperId } = useParams<{ helperId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [helperData, setHelperData] = useState<HelperData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHelperReviews();
  }, [helperId]);

  const fetchHelperReviews = async () => {
    try {
      const response = await fetch(getApiUrl(`/api/reviews/helper/${helperId}`));
      
      if (response.ok) {
        const data = await response.json();
        setHelperData(data);
      } else {
        throw new Error('Failed to fetch reviews');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load helper reviews",
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
    if (!helperData?.reviews || helperData.reviews.length === 0) return [];
    
    const distribution = [0, 0, 0, 0, 0];
    helperData.reviews.forEach((review) => {
      distribution[review.rating - 1]++;
    });
    
    return distribution.reverse(); // Show 5 stars first
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar role="user" />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!helperData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar role="user" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Helper Not Found</h1>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  const distribution = getRatingDistribution();

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="user" />
      
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

          {/* Helper Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <User className="h-6 w-6" />
                {helperData.name}'s Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Overall Rating */}
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {helperData.rating ? helperData.rating.toFixed(1) : '0.0'}
                  </div>
                  <div className="flex justify-center mb-2">
                    {renderStars(Math.round(helperData.rating || 0))}
                  </div>
                  <p className="text-muted-foreground">
                    {helperData.totalRatings || 0} {helperData.totalRatings === 1 ? 'review' : 'reviews'}
                  </p>
                </div>

                {/* Rating Distribution */}
                <div className="md:col-span-2">
                  <h4 className="font-semibold mb-3">Rating Distribution</h4>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star, index) => {
                      const count = distribution[index] || 0;
                      const percentage = helperData.totalRatings 
                        ? (count / helperData.totalRatings) * 100 
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
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Tasks</p>
                  <p className="text-2xl font-bold">{helperData.completedTasks || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{helperData.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">All Reviews</h2>
            
            {helperData.reviews && helperData.reviews.length > 0 ? (
              helperData.reviews.map((review) => (
                <Card key={review._id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {renderStars(review.rating)}
                          <span className="font-semibold">{review.rating}.0</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          by {review.reviewerName}
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
                    This helper hasn't received any reviews yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelperReviewsPage;
