
import React from 'react';
import { X } from 'lucide-react';
import { Face } from './PhotoGallery';

interface FaceFiltersProps {
  faces: Face[];
  selectedFaces: string[];
  onToggleFace: (faceId: string) => void;
  onClearSelection: () => void;
}

export const FaceFilters: React.FC<FaceFiltersProps> = ({ 
  faces,
  selectedFaces,
  onToggleFace,
  onClearSelection
}) => {
  return (
    <div className="glass py-3 px-4 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Filter by faces</h3>
        {selectedFaces.length > 0 && (
          <button 
            onClick={onClearSelection}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center"
          >
            Clear <X size={12} className="ml-1" />
          </button>
        )}
      </div>
      
      <div className="flex items-center space-x-2 overflow-x-auto py-2">
        {faces.length === 0 ? (
          <p className="text-sm text-muted-foreground">No faces detected</p>
        ) : (
          faces.map(face => (
            <button
              key={face.id}
              onClick={() => onToggleFace(face.id)}
              className={`face-filter flex-shrink-0 rounded-full overflow-hidden w-12 h-12 ${
                selectedFaces.includes(face.id) ? 'selected' : ''
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
        <div className="mt-2 text-xs text-muted-foreground">
          {selectedFaces.length} {selectedFaces.length === 1 ? 'face' : 'faces'} selected
        </div>
      )}
    </div>
  );
};
