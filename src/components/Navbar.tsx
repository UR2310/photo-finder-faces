
import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Image, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  
  return (
    <nav className="sticky top-0 z-50 glass">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-foreground hover:opacity-80 transition-opacity"
          >
            <Image size={24} className="text-primary" />
            <span className="font-semibold text-xl tracking-tight">PhotoFinder</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-all hover:text-primary ${
                location.pathname === '/' ? 'text-primary' : 'text-foreground'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/photos" 
              className={`text-sm font-medium transition-all hover:text-primary ${
                location.pathname === '/photos' ? 'text-primary' : 'text-foreground'
              }`}
            >
              Photos
            </Link>
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
              <User size={16} className="text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
