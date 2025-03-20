
import React, { useState, useEffect } from 'react';
import { PhotoCard } from './PhotoCard';
import { FaceFilters } from './FaceFilters';
import { getPhotosWithFaces } from '../services/googlePhotos';
import { extractFaces } from '../services/faceDetection';
import { Loader2 } from 'lucide-react';

export interface Photo {
  id: string;
  url: string;
  thumbnail: string;
  date: string;
  faces: string[];
}

export interface Face {
  id: string;
  thumbnail: string;
  name?: string;
}

export const PhotoGallery: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [faces, setFaces] = useState<Face[]>([]);
  const [selectedFaces, setSelectedFaces] = useState<string[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);

  // Simulate fetching data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // This would be replaced with actual API calls
        const photosData = await getPhotosWithFaces();
        const facesData = await extractFaces(photosData);
        
        setPhotos(photosData);
        setFaces(facesData);
        setFilteredPhotos(photosData);
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter photos based on selected faces
  useEffect(() => {
    if (selectedFaces.length === 0) {
      setFilteredPhotos(photos);
    } else {
      const filtered = photos.filter(photo => 
        selectedFaces.every(faceId => photo.faces.includes(faceId))
      );
      setFilteredPhotos(filtered);
    }
  }, [selectedFaces, photos]);

  // Handle face selection
  const toggleFaceSelection = (faceId: string) => {
    setSelectedFaces(prev => 
      prev.includes(faceId)
        ? prev.filter(id => id !== faceId)
        : [...prev, faceId]
    );
  };

  // Clear all selected faces
  const clearSelectedFaces = () => {
    setSelectedFaces([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <FaceFilters 
        faces={faces} 
        selectedFaces={selectedFaces} 
        onToggleFace={toggleFaceSelection}
        onClearSelection={clearSelectedFaces}
      />
      
      <div className="mt-8">
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No photos match your selected faces.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map(photo => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
