import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import { CheckCircle, Users, Clock, Star, Shield, Zap } from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: 'Trusted Community',
      description: 'Connect with verified helpers in your area for reliable task completion.',
    },
    {
      icon: Clock,
      title: 'Quick Matching',
      description: 'Post a task and get matched with qualified helpers within minutes.',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'All helpers are verified through our comprehensive KYC process.',
    },
    {
      icon: Star,
      title: 'Quality Guarantee',
      description: 'Rate and review system ensures consistent high-quality service.',
    },
    {
      icon: Zap,
      title: 'Instant Updates',
      description: 'Real-time notifications keep you updated on task progress.',
    },
    {
      icon: CheckCircle,
      title: 'Easy Management',
      description: 'Intuitive dashboard to manage all your tasks in one place.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
            Get Tasks Done,
            <span className="text-primary block">Effortlessly</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            Connect with skilled helpers in your community. Post tasks, find reliable service providers, 
            and get things done quickly and efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link to="/auth/signup">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                Get Started Today
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose GetItDone?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform makes it simple to connect task creators with skilled helpers, 
              ensuring quality results every time.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-soft transition-smooth group animate-fade-in">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-smooth">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Getting tasks done has never been easier
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-primary-foreground text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Post Your Task</h3>
              <p className="text-muted-foreground">
                Describe what you need done, set your budget, and choose a deadline.
              </p>
            </div>
            
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-primary-foreground text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Matched</h3>
              <p className="text-muted-foreground">
                Qualified helpers review your task and submit proposals to work with you.
              </p>
            </div>
            
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-primary-foreground text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Task Complete</h3>
              <p className="text-muted-foreground">
                Your chosen helper completes the task, and you can rate their service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of users who are already getting their tasks done efficiently. 
            Sign up today and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/signup?role=user">
              <Button variant="secondary" size="xl" className="w-full sm:w-auto">
                I Need Help With Tasks
              </Button>
            </Link>
            <Link to="/auth/signup?role=helper">
              <Button variant="outline" size="xl" className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                I Want to Help Others
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/lovable-uploads/08545713-0aec-48d1-91be-f641732e209d.png" alt="GetItDone" className="h-8 w-8" />
                <span className="font-bold text-xl">GetItDone</span>
              </div>
              <p className="text-muted opacity-80">
                The trusted platform for getting tasks done efficiently and reliably.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Users</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link to="/auth/signup" className="hover:opacity-100">Post a Task</Link></li>
                <li><Link to="/auth/login" className="hover:opacity-100">Find Helpers</Link></li>
                <li><a href="#" className="hover:opacity-100">How it Works</a></li>
                <li><a href="#" className="hover:opacity-100">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Helpers</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link to="/auth/signup?role=helper" className="hover:opacity-100">Become a Helper</Link></li>
                <li><Link to="/auth/login" className="hover:opacity-100">Find Tasks</Link></li>
                <li><a href="#" className="hover:opacity-100">Helper Guidelines</a></li>
                <li><a href="#" className="hover:opacity-100">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100">Help Center</a></li>
                <li><a href="#" className="hover:opacity-100">Contact Us</a></li>
                <li><a href="#" className="hover:opacity-100">Privacy Policy</a></li>
                <li><a href="#" className="hover:opacity-100">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-muted/20 mt-8 pt-8 text-center text-sm opacity-80">
            <p>&copy; 2024 GetItDone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;