
import React, { useState } from 'react';
import { Photo } from './PhotoGallery';

interface PhotoCardProps {
  photo: Photo;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo }) => {
  const [loaded, setLoaded] = useState(false);
  
  const handleImageLoaded = () => {
    setLoaded(true);
  };
  
  return (
    <div 
      className="photo-hover overflow-hidden rounded-lg bg-card shadow-soft relative"
    >
      <div className="aspect-square relative overflow-hidden">
        <div className={`absolute inset-0 bg-secondary animate-pulse ${loaded ? 'opacity-0' : 'opacity-100'}`} />
        <img 
          src={photo.thumbnail} 
          alt="Photo" 
          className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoaded}
          loading="lazy"
        />
      </div>
      
      <div className="p-3">
        <div className="text-xs text-muted-foreground mb-1">
          {new Date(photo.date).toLocaleDateString()}
        </div>
        
        {photo.faces.length > 0 && (
          <div className="flex -space-x-2 overflow-hidden">
            {photo.faces.slice(0, 5).map((faceId, index) => (
              <div 
                key={`${photo.id}-face-${index}`}
                className="inline-block h-6 w-6 rounded-full ring-2 ring-background"
              >
                <img 
                  src={`/assets/face-placeholder-${(parseInt(faceId.substring(0, 2), 16) % 5) + 1}.jpg`} 
                  alt="Face" 
                  className="h-full w-full object-cover rounded-full"
                />
              </div>
            ))}
            {photo.faces.length > 5 && (
              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-medium ring-2 ring-background">
                +{photo.faces.length - 5}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
