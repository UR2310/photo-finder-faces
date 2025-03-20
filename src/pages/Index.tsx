
import React from 'react';
import { Layout } from '../components/Layout';
import { Hero } from '../components/Hero';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Image, Filter } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      <Hero />
      
      <section id="how-it-works" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our application seamlessly connects to your Google Photos and uses advanced facial recognition
              to help you find the perfect photos in seconds.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl p-6 shadow-soft transition-all hover:shadow-glass animate-fade-up" style={{ animationDelay: '100ms' }}>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Image className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Photos</h3>
              <p className="text-muted-foreground mb-4">
                Connect to your Google Photos account to give our app access to your photo library.
              </p>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-soft transition-all hover:shadow-glass animate-fade-up" style={{ animationDelay: '200ms' }}>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Face Detection</h3>
              <p className="text-muted-foreground mb-4">
                Our system automatically scans your photos and extracts all the faces it can find.
              </p>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-soft transition-all hover:shadow-glass animate-fade-up" style={{ animationDelay: '300ms' }}>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Filter className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Filter & Find</h3>
              <p className="text-muted-foreground mb-4">
                Select one or multiple faces to instantly filter your photo collection to find exactly what you're looking for.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/photos" 
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
            >
              Try it now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      
      <section className="py-20 px-6 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto">
          <div className="bg-card rounded-2xl overflow-hidden shadow-glass">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-block px-3 py-1 mb-4 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  Private & Secure
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Your Photos Stay Private</h2>
                <p className="text-muted-foreground mb-6">
                  We prioritize your privacy. All face detection happens securely on our servers,
                  and we never store your photos without permission.
                </p>
                <Link
                  to="/photos"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors self-start"
                >
                  Get Started
                </Link>
              </div>
              <div className="bg-gradient-to-tr from-primary/80 to-blue-500/80 p-8 md:p-12 flex items-center justify-center">
                <div className="relative w-full max-w-sm">
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/20 rounded-lg blur-xl"></div>
                  <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl">
                    <div className="flex items-center space-x-2 mb-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm"></div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 rounded-lg bg-white/20 backdrop-blur-sm flex items-center p-2">
                          <div className="w-12 h-12 rounded bg-white/30 mr-3"></div>
                          <div className="space-y-1">
                            <div className="h-2 w-24 bg-white/30 rounded"></div>
                            <div className="h-2 w-16 bg-white/20 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
