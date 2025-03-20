
import React from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="py-6 px-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} PhotoFinder. All rights reserved.</p>
      </footer>
    </div>
  );
};
