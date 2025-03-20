
import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';

const Index = () => {
  return (
    <Layout>
      <div className="mt-12 text-center">
        <h1 className="text-4xl font-bold mb-6">
          Find your photos by faces
        </h1>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Connect to your Google Photos and instantly filter through your collection 
          by recognizing the faces that matter most to you.
        </p>
        <Link to="/photos" className="bg-blue-500 text-white px-6 py-3 rounded">
          Browse Photos
        </Link>
      </div>
      
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-4 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="border p-6 rounded">
            <h3 className="text-xl font-semibold mb-2">Connect Photos</h3>
            <p>Connect to your Google Photos account to give our app access to your photo library.</p>
          </div>
          <div className="border p-6 rounded">
            <h3 className="text-xl font-semibold mb-2">Face Detection</h3>
            <p>Our system automatically scans your photos and extracts all the faces it can find.</p>
          </div>
          <div className="border p-6 rounded">
            <h3 className="text-xl font-semibold mb-2">Filter & Find</h3>
            <p>Select one or multiple faces to instantly filter your photo collection.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
