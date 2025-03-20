
import { Photo } from '../components/PhotoGallery';

// This is a mock implementation that would be replaced with actual Google Photos API integration
// Once connected to Django, this would call the backend API

const dummyPhotos: Photo[] = [
  {
    id: '1',
    url: '/assets/photo-1.jpg',
    thumbnail: '/assets/photo-1.jpg',
    date: '2023-06-15',
    faces: ['face1', 'face2']
  },
  {
    id: '2',
    url: '/assets/photo-2.jpg',
    thumbnail: '/assets/photo-2.jpg',
    date: '2023-07-22',
    faces: ['face1', 'face3']
  },
  {
    id: '3',
    url: '/assets/photo-3.jpg',
    thumbnail: '/assets/photo-3.jpg',
    date: '2023-08-10',
    faces: ['face2', 'face3']
  },
  {
    id: '4',
    url: '/assets/photo-4.jpg',
    thumbnail: '/assets/photo-4.jpg',
    date: '2023-09-05',
    faces: ['face1', 'face2', 'face3']
  },
  {
    id: '5',
    url: '/assets/photo-5.jpg',
    thumbnail: '/assets/photo-5.jpg',
    date: '2023-10-18',
    faces: ['face3']
  },
  {
    id: '6',
    url: '/assets/photo-6.jpg',
    thumbnail: '/assets/photo-6.jpg',
    date: '2023-11-30',
    faces: ['face1']
  },
  {
    id: '7',
    url: '/assets/photo-7.jpg',
    thumbnail: '/assets/photo-7.jpg',
    date: '2023-12-25',
    faces: ['face2']
  },
  {
    id: '8',
    url: '/assets/photo-8.jpg',
    thumbnail: '/assets/photo-8.jpg',
    date: '2024-01-01',
    faces: ['face1', 'face3']
  }
];

// Simulates fetching photos from Google Photos
export const getPhotosWithFaces = async (): Promise<Photo[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real implementation, this would connect to Google Photos API
  // and fetch actual user photos
  return dummyPhotos;
};

// Simulates connecting to Google Photos API
export const connectToGooglePhotos = async (): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real implementation, this would initiate OAuth flow
  // and return success/failure
  return true;
};
