import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Check, Crown, Zap, Shield, Clock } from 'lucide-react';
import { getApiUrl } from '@/lib/utils/api-url';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const SubscriptionPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchSubscriptionStatus();
    loadRazorpayScript();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchSubscriptionStatus = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(getApiUrl('/api/subscription/status'), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscriptionStatus(data.subscription);
      }
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
    }
  };

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      
      // Create order
      const orderResponse = await fetch(getApiUrl('/api/subscription/create-order'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const { order } = await orderResponse.json();

      // Initialize Razorpay
      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your Razorpay key
        amount: order.amount,
        currency: order.currency,
        name: 'GetItDone',
        description: `${plan === 'monthly' ? 'Monthly' : 'Yearly'} Subscription`,
        order_id: order.id,
        handler: async function (response: any) {
          // Verify payment
          try {
            const verifyResponse = await fetch(getApiUrl('/api/subscription/verify-payment'), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: plan,
              }),
            });

            if (verifyResponse.ok) {
              toast({
                title: 'Subscription Activated!',
                description: 'Your subscription has been activated successfully.',
              });
              fetchSubscriptionStatus();
              navigate('/helper');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            toast({
              variant: 'destructive',
              title: 'Payment Verification Failed',
              description: 'Please contact support.',
            });
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || '',
          email: '', // You can fetch user email
        },
        theme: {
          color: '#6366f1',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to initiate payment. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (!subscriptionStatus) return null;
    
    switch (subscriptionStatus.status) {
      case 'trial':
        return <Badge className="bg-blue-100 text-blue-800">Free Trial</Badge>;
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active Subscription</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      default:
        return <Badge variant="secondary">No Subscription</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="helper" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-4">Choose Your Plan</h1>
            <p className="text-lg text-muted-foreground">
              Unlock unlimited task opportunities and grow your earnings
            </p>
          </div>

          {/* Current Status */}
          {subscriptionStatus && (
            <Card className="mb-8 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Current Status</h3>
                    <div className="flex items-center gap-3">
                      {getStatusBadge()}
                      {subscriptionStatus.status === 'trial' && (
                        <span className="text-sm text-muted-foreground">
                          {subscriptionStatus.trialTasksCompleted} / {subscriptionStatus.trialTasksLimit} tasks completed
                        </span>
                      )}
                      {subscriptionStatus.status === 'active' && subscriptionStatus.endDate && (
                        <span className="text-sm text-muted-foreground">
                          Valid until {new Date(subscriptionStatus.endDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  {subscriptionStatus.status === 'trial' && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Tasks remaining</p>
                      <p className="text-2xl font-bold text-primary">
                        {subscriptionStatus.trialTasksLimit - subscriptionStatus.trialTasksCompleted}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Monthly Plan */}
            <Card className="relative overflow-hidden animate-fade-in hover:shadow-lg transition-shadow">
              <CardHeader className="pb-8">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-2xl">Monthly Plan</CardTitle>
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-foreground">₹99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3" />
                    <span>Unlimited task acceptance</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3" />
                    <span>Advanced task filters</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3" />
                    <span>Earnings analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3" />
                    <span>Profile badge</span>
                  </li>
                </ul>
                <Button
                  onClick={() => handleSubscribe('monthly')}
                  disabled={loading || subscriptionStatus?.status === 'active'}
                  className="w-full"
                  variant="hero"
                >
                  {subscriptionStatus?.status === 'active' ? 'Current Plan' : 'Subscribe Monthly'}
                </Button>
              </CardContent>
            </Card>

            {/* Yearly Plan */}
            <Card className="relative overflow-hidden animate-fade-in hover:shadow-lg transition-shadow border-2 border-primary">
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary">
                  <Crown className="h-3 w-3 mr-1" />
                  Best Value
                </Badge>
              </div>
              <CardHeader className="pb-8">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-2xl">Yearly Plan</CardTitle>
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-foreground">₹999</span>
                  <span className="text-muted-foreground">/year</span>
                </div>
                <p className="text-sm text-green-600 font-medium mt-2">
                  Save ₹1,000 (17% off)
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3" />
                    <span className="font-medium">Everything in Monthly, plus:</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3" />
                    <span>2 months free</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3" />
                    <span>Premium profile badge</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3" />
                    <span>Featured in search results</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3" />
                    <span>Exclusive offers & promotions</span>
                  </li>
                </ul>
                <Button
                  onClick={() => handleSubscribe('yearly')}
                  disabled={loading || subscriptionStatus?.status === 'active'}
                  className="w-full"
                  variant="hero"
                >
                  {subscriptionStatus?.status === 'active' ? 'Current Plan' : 'Subscribe Yearly'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Free Trial Info */}
          {subscriptionStatus?.status === 'none' || !subscriptionStatus && (
            <Card className="animate-fade-in bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      New to GetItDone? Start with a Free Trial!
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      Complete up to 5 tasks for free. No credit card required. Once you complete your trial tasks,
                      choose a plan to continue earning.
                    </p>
                    <Button onClick={() => navigate('/helper/available-tasks')} variant="outline">
                      Browse Available Tasks
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* FAQ Section */}
          <div className="mt-12 animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                  <p className="text-sm text-muted-foreground">
                    We accept all major credit/debit cards, UPI, net banking, and digital wallets through Razorpay.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Is my payment information secure?</h3>
                  <p className="text-sm text-muted-foreground">
                    Absolutely. We use Razorpay's secure payment gateway. We never store your card details.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Can I switch between plans?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
