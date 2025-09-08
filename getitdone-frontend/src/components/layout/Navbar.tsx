import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/enhanced-button';
import { LogOut, User, Settings, Home, Plus, List } from 'lucide-react';

interface NavbarProps {
  role?: 'user' | 'helper' | 'admin' | null;
}

const Navbar: React.FC<NavbarProps> = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  if (!role) {
    // Landing page navbar
    return (
      <nav className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50 shadow-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-fast">
            <img src="/lovable-uploads/08545713-0aec-48d1-91be-f641732e209d.png" alt="GetItDone" className="h-8 w-8" />
            <span className="font-bold text-xl text-primary">GetItDone</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth/signup">
              <Button variant="hero">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // Dashboard navbars
  const getDashboardNavItems = () => {
    switch (role) {
      case 'user':
        return [
          { name: 'Home', path: '/user', icon: Home },
          { name: 'Create Task', path: '/user/create-task', icon: Plus },
          { name: 'My Tasks', path: '/user/my-tasks', icon: List },
          { name: 'Profile', path: '/user/profile', icon: User },
        ];
      case 'helper':
        return [
          { name: 'Home', path: '/helper', icon: Home },
          { name: 'Available Tasks', path: '/helper/available-tasks', icon: List },
          { name: 'My Tasks', path: '/helper/my-tasks', icon: List },
          { name: 'Profile', path: '/helper/profile', icon: User },
        ];
      case 'admin':
        return [
          { name: 'Pending Helpers', path: '/admin/pending-helpers', icon: User },
          { name: 'Approved Helpers', path: '/admin/approved-helpers', icon: Settings },
          { name: 'All Tasks', path: '/admin/all-tasks', icon: List },
        ];
      default:
        return [];
    }
  };

  const navItems = getDashboardNavItems();

  return (
    <nav className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50 shadow-card">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to={`/${role}`} className="flex items-center space-x-2 hover:opacity-80 transition-fast">
          <img src="/lovable-uploads/08545713-0aec-48d1-91be-f641732e209d.png" alt="GetItDone" className="h-8 w-8" />
          <span className="font-bold text-xl text-primary">GetItDone</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-fast ${
                  isActive(item.path) 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.name}</span>
              </Link>
            );
          })}
          
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;