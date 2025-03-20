
import cv2
import numpy as np
import face_recognition
import requests
from io import BytesIO
from PIL import Image
from django.conf import settings
from ..models import Face


def download_image(image_url, access_token=None):
    """
    Download an image from a URL.
    """
    headers = {}
    if access_token:
        headers['Authorization'] = f'Bearer {access_token}'
    
    response = requests.get(image_url, headers=headers)
    if response.status_code == 200:
        return np.array(Image.open(BytesIO(response.content)))
    else:
        print(f"Error downloading image: {response.status_code}")
        return None


def detect_faces(image_url, access_token=None):
    """
    Detect faces in an image from a URL.
    Returns a list of face data (encodings, locations, thumbnails).
    """
    # Download image
    image = download_image(image_url, access_token)
    if image is None:
        return []
    
    # Convert to RGB (face_recognition uses RGB)
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Find face locations
    face_locations = face_recognition.face_locations(rgb_image, model="hog")
    
    if not face_locations:
        return []
    
    # Get face encodings
    face_encodings = face_recognition.face_encodings(rgb_image, face_locations)
    
    # Prepare result
    result = []
    for i, (encoding, location) in enumerate(zip(face_encodings, face_locations)):
        # Extract face thumbnail
        top, right, bottom, left = location
        face_image = rgb_image[top:bottom, left:right]
        
        # Convert face image to bytes
        pil_image = Image.fromarray(face_image)
        buffer = BytesIO()
        pil_image.save(buffer, format="JPEG")
        face_thumbnail = buffer.getvalue()
        
        # Add to results
        result.append({
            'encoding': encoding.tobytes(),  # Convert numpy array to binary for storage
            'location': location,
            'thumbnail': face_thumbnail,
            'confidence': 1.0  # Default confidence
        })
    
    return result


def recognize_face(face_data, user):
    """
    Try to recognize a face by comparing it to existing faces.
    Returns the matching Face object or None if no match found.
    """
    # Get the face encoding as numpy array
    face_encoding = np.frombuffer(face_data['encoding'], dtype=np.float64)
    
    # Get all existing faces for the user
    existing_faces = Face.objects.filter(user=user)
    
    for existing_face in existing_faces:
        if existing_face.face_encoding:
            # Convert stored encoding back to numpy array
            existing_encoding = np.frombuffer(existing_face.face_encoding, dtype=np.float64)
            
            # Compare encodings
            matches = face_recognition.compare_faces([existing_encoding], face_encoding, tolerance=0.6)
            
            if matches[0]:
                # Calculate similarity (lower distance = more similar)
                face_distance = face_recognition.face_distance([existing_encoding], face_encoding)[0]
                similarity = 1.0 - min(face_distance, 1.0)
                
                # If similarity is high enough, return this face
                if similarity > 0.5:  # Adjust threshold as needed
                    return existing_face
    
    # No matching face found
    return None
