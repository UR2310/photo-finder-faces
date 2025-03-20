
import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';

const NotFound = () => {
  return (
    <Layout>
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Page not found</p>
        <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded">
          Go Home
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
