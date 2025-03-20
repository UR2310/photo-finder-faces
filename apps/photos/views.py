
import json
import os
import requests
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.conf import settings
from django.http import JsonResponse
from django.contrib import messages
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Photo, Face, PhotoFace, GoogleCredential
from .utils.google_photos import get_google_auth_url, exchange_code_for_token, refresh_access_token, fetch_photos
from .utils.face_detection import detect_faces, recognize_face


def photo_list(request):
    """
    Display all photos or filtered photos based on selected faces.
    """
    if not request.user.is_authenticated:
        return redirect('users:login')
        
    try:
        # Check if the user has connected to Google Photos
        google_credential = request.user.google_credential
        
        # If token is expired, refresh it
        if google_credential.is_expired():
            refresh_access_token(google_credential)
            
        # Get selected face IDs from query parameters
        selected_face_ids = request.GET.getlist('face')
        selected_face_ids = [int(face_id) for face_id in selected_face_ids if face_id.isdigit()]
        
        # Get all faces for the user
        all_faces = Face.objects.filter(user=request.user)
        
        # Filter photos based on selected faces
        if selected_face_ids:
            # Filter photos that contain ALL selected faces
            photos = Photo.objects.filter(
                user=request.user,
                photo_faces__face__id__in=selected_face_ids
            ).distinct()
            
            # Refine to ensure all faces are in each photo
            for face_id in selected_face_ids:
                photos = photos.filter(photo_faces__face__id=face_id)
        else:
            # Show all photos
            photos = Photo.objects.filter(user=request.user)
        
        context = {
            'photos': photos,
            'faces': all_faces,
            'selected_face_ids': selected_face_ids,
        }
        return render(request, 'photos/photo_list.html', context)
        
    except GoogleCredential.DoesNotExist:
        # User hasn't connected Google Photos yet
        return redirect('photos:connect_google_photos')


@login_required
def connect_google_photos(request):
    """
    Redirect user to Google OAuth authorization page.
    """
    auth_url = get_google_auth_url()
    return redirect(auth_url)


@login_required
def google_auth_callback(request):
    """
    Handle callback from Google OAuth authorization.
    """
    code = request.GET.get('code')
    error = request.GET.get('error')
    
    if error:
        messages.error(request, f"Google OAuth error: {error}")
        return redirect('core:index')
    
    if not code:
        messages.error(request, "No authorization code received from Google.")
        return redirect('core:index')
    
    # Exchange code for tokens
    token_data = exchange_code_for_token(code)
    
    if not token_data:
        messages.error(request, "Failed to exchange code for token.")
        return redirect('core:index')
    
    # Calculate token expiry time
    expires_in = token_data.get('expires_in', 3600)
    token_expiry = timezone.now() + timedelta(seconds=expires_in)
    
    # Save or update Google credentials
    GoogleCredential.objects.update_or_create(
        user=request.user,
        defaults={
            'access_token': token_data['access_token'],
            'refresh_token': token_data.get('refresh_token', ''),  # May not be present on re-authorization
            'token_expiry': token_expiry,
        }
    )
    
    messages.success(request, "Successfully connected to Google Photos!")
    return redirect('photos:photo_list')


@login_required
def process_photos(request):
    """
    Process user's Google Photos to detect and extract faces.
    """
    try:
        # Check if user has connected to Google Photos
        google_credential = request.user.google_credential
        
        # If token is expired, refresh it
        if google_credential.is_expired():
            refresh_access_token(google_credential)
        
        # Fetch photos from Google Photos
        photos_data = fetch_photos(google_credential)
        
        # Process and save photos
        for photo_data in photos_data:
            # Create or update photo record
            photo, created = Photo.objects.update_or_create(
                user=request.user,
                google_photo_id=photo_data['id'],
                defaults={
                    'url': photo_data['productUrl'],
                    'thumbnail_url': photo_data['baseUrl'] + '=w220-h220',
                    'date_taken': datetime.fromisoformat(photo_data.get('mediaMetadata', {}).get('creationTime', '').replace('Z', '+00:00')),
                }
            )
            
            # If the photo already existed and has faces, skip face detection
            if not created and photo.photo_faces.exists():
                continue
            
            # Detect faces in the photo
            detected_faces = detect_faces(photo.url, google_credential.access_token)
            
            # Process detected faces
            for face_data in detected_faces:
                # Try to recognize the face among existing faces
                existing_face = recognize_face(face_data, request.user)
                
                if existing_face:
                    # If the face is recognized, link it to the photo
                    PhotoFace.objects.get_or_create(
                        photo=photo,
                        face=existing_face,
                        defaults={'confidence': face_data['confidence']}
                    )
                else:
                    # If it's a new face, create a new face record
                    new_face = Face.objects.create(
                        user=request.user,
                        face_encoding=face_data['encoding'],
                    )
                    
                    # Save the face thumbnail
                    if 'thumbnail' in face_data:
                        from django.core.files.base import ContentFile
                        new_face.thumbnail.save(
                            f"face_{new_face.id}.jpg",
                            ContentFile(face_data['thumbnail']),
                            save=True
                        )
                    
                    # Link the new face to the photo
                    PhotoFace.objects.create(
                        photo=photo,
                        face=new_face,
                        confidence=face_data['confidence']
                    )
        
        messages.success(request, "Photos processed successfully!")
        return redirect('photos:photo_list')
        
    except GoogleCredential.DoesNotExist:
        return redirect('photos:connect_google_photos')
    except Exception as e:
        messages.error(request, f"Error processing photos: {str(e)}")
        return redirect('photos:photo_list')


@login_required
def face_list(request):
    """
    Display all detected faces for the user.
    """
    faces = Face.objects.filter(user=request.user)
    return render(request, 'photos/face_list.html', {'faces': faces})


@login_required
def face_detail(request, face_id):
    """
    Display details of a specific face and all photos containing it.
    """
    face = get_object_or_404(Face, id=face_id, user=request.user)
    
    # Get all photos containing this face
    photos = Photo.objects.filter(photo_faces__face=face)
    
    # Handle name update
    if request.method == 'POST':
        name = request.POST.get('name', '')
        if name:
            face.name = name
            face.save()
            messages.success(request, f"Face renamed to {name}!")
    
    context = {
        'face': face,
        'photos': photos,
    }
    return render(request, 'photos/face_detail.html', context)
