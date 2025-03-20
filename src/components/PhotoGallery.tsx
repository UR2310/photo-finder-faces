
import React, { useState, useEffect } from 'react';
import { getPhotosWithFaces } from '../services/googlePhotos';
import { extractFaces } from '../services/faceDetection';

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
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      {/* Face Filters */}
      <div className="mb-8 p-4 border rounded">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Filter by faces</h3>
          {selectedFaces.length > 0 && (
            <button 
              onClick={clearSelectedFaces}
              className="text-sm text-blue-500"
            >
              Clear
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 py-2">
          {faces.length === 0 ? (
            <p className="text-gray-500">No faces detected</p>
          ) : (
            faces.map(face => (
              <button
                key={face.id}
                onClick={() => toggleFaceSelection(face.id)}
                className={`rounded-full overflow-hidden w-12 h-12 border-2 ${
                  selectedFaces.includes(face.id) ? 'border-blue-500' : 'border-transparent'
                }`}
              >
                <img 
                  src={face.thumbnail} 
                  alt={face.name || 'Unknown face'} 
                  className="w-full h-full object-cover"
                />
              </button>
            ))
          )}
        </div>
        
        {selectedFaces.length > 0 && (
          <div className="mt-2 text-sm text-gray-500">
            {selectedFaces.length} {selectedFaces.length === 1 ? 'face' : 'faces'} selected
          </div>
        )}
      </div>
      
      {/* Photos Grid */}
      <div>
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No photos match your selected faces.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map(photo => (
              <div key={photo.id} className="border rounded overflow-hidden">
                <div className="aspect-square">
                  <img 
                    src={photo.thumbnail} 
                    alt="Photo" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-2">
                  <div className="text-xs text-gray-500 mb-1">
                    {new Date(photo.date).toLocaleDateString()}
                  </div>
                  {photo.faces.length > 0 && (
                    <div className="flex -space-x-2 overflow-hidden">
                      {photo.faces.slice(0, 5).map((faceId, index) => (
                        <div 
                          key={`${photo.id}-face-${index}`}
                          className="inline-block h-6 w-6 rounded-full border-2 border-white"
                        >
                          <img 
                            src={`/assets/face-placeholder-${(parseInt(faceId.substring(0, 2), 16) % 5) + 1}.jpg`} 
                            alt="Face" 
                            className="h-full w-full object-cover rounded-full"
                          />
                        </div>
                      ))}
                      {photo.faces.length > 5 && (
                        <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-medium border-2 border-white">
                          +{photo.faces.length - 5}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
