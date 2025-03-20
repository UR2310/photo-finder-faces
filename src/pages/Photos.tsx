
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { PhotoGallery } from '../components/PhotoGallery';
import { connectToGooglePhotos } from '../services/googlePhotos';
import { Loader2 } from 'lucide-react';

const Photos = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const handleConnectToGoogle = async () => {
    try {
      setConnecting(true);
      const success = await connectToGooglePhotos();
      if (success) {
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Failed to connect to Google Photos:', error);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Your Photos</h1>
        <p className="text-muted-foreground mb-6">
          Browse and filter your photos by the faces in them
        </p>

        {!isConnected ? (
          <div className="bg-card rounded-xl shadow-soft p-8 text-center max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-3">Connect to Google Photos</h2>
            <p className="text-muted-foreground mb-6">
              To get started, please connect your Google Photos account to allow our app to access your photos.
            </p>
            <button
              onClick={handleConnectToGoogle}
              disabled={connecting}
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors disabled:opacity-70"
            >
              {connecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect to Google Photos'
              )}
            </button>
          </div>
        ) : (
          <PhotoGallery />
        )}
      </div>
    </Layout>
  );
};

export default Photos;
