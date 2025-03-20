
import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <nav className="bg-blue-500 text-white p-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">PhotoFinder</Link>
            <div>
              <Link to="/" className="mr-4">Home</Link>
              <Link to="/photos" className="mr-4">Photos</Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        {children}
      </main>
      <footer className="bg-gray-200 p-4 text-center mt-8">
        <p>© {new Date().getFullYear()} PhotoFinder. All rights reserved.</p>
      </footer>
    </div>
  );
};
