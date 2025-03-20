
import React from 'react';
import { Layout } from '../components/Layout';
import { PhotoGallery } from '../components/PhotoGallery';

const Photos = () => {
  return (
    <Layout>
      <div className="mt-8">
        <h1 className="text-3xl font-bold mb-6">Your Photos</h1>
        <PhotoGallery />
      </div>
    </Layout>
  );
};

export default Photos;
