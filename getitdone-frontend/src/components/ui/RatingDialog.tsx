import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/enhanced-button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';

interface RatingDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => Promise<void>;
  taskTitle: string;
  helperName?: string;
}

const RatingDialog: React.FC<RatingDialogProps> = ({
  open,
  onClose,
  onSubmit,
  taskTitle,
  helperName,
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(rating, review);
      setRating(0);
      setHoverRating(0);
      setReview('');
      onClose();
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Rate & Review Helper</DialogTitle>
          <DialogDescription>
            Share your experience with {helperName || 'the helper'} for the task "{taskTitle}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating *</label>
            <div className="flex items-center gap-2">
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
                    className={`h-8 w-8 ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {rating > 0 ? `${rating} ${rating === 1 ? 'star' : 'stars'}` : 'Select rating'}
              </span>
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Review (Optional)</label>
            <Textarea
              placeholder="Share details about your experience..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {review.length}/500 characters
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="hero"
            onClick={handleSubmit}
            disabled={rating === 0 || loading}
          >
            {loading ? 'Submitting...' : 'Submit Rating'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;
