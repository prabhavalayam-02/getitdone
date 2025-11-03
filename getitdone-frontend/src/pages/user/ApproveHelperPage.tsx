import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import { Loader2 } from 'lucide-react';

const ApproveHelperPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const approveHelper = async () => {
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
            description: "Please log in to approve helpers.",
          });
          navigate('/auth/login');
          return;
        }

        const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/approve-helper`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          toast({
            title: "Helper Approved!",
            description: "The helper has been notified and the task has started.",
          });
          navigate('/user/my-tasks');
        } else {
          const data = await response.json();
          toast({
            variant: "destructive",
            title: "Error",
            description: data.msg || "Failed to approve helper.",
          });
          navigate('/user/my-tasks');
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Network Error",
          description: "Failed to connect to the server. Please try again.",
        });
        navigate('/user/my-tasks');
      }
    };

    approveHelper();
  }, [taskId, navigate, toast]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="user" />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Approving Helper...</h2>
              <p className="text-muted-foreground">Please wait while we process your request.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApproveHelperPage;
