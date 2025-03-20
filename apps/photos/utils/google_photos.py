
import requests
import os
from urllib.parse import urlencode
from django.conf import settings


def get_google_auth_url():
    """
    Generate the Google OAuth2 authorization URL.
    """
    params = {
        'client_id': settings.GOOGLE_OAUTH2_CLIENT_ID,
        'redirect_uri': settings.GOOGLE_OAUTH2_REDIRECT_URI,
        'scope': ' '.join(settings.GOOGLE_PHOTOS_SCOPES),
        'response_type': 'code',
        'access_type': 'offline',
        'prompt': 'consent',
    }
    
    auth_url = 'https://accounts.google.com/o/oauth2/auth?' + urlencode(params)
    return auth_url


def exchange_code_for_token(code):
    """
    Exchange authorization code for access and refresh tokens.
    """
    token_url = 'https://oauth2.googleapis.com/token'
    
    data = {
        'client_id': settings.GOOGLE_OAUTH2_CLIENT_ID,
        'client_secret': settings.GOOGLE_OAUTH2_CLIENT_SECRET,
        'code': code,
        'redirect_uri': settings.GOOGLE_OAUTH2_REDIRECT_URI,
        'grant_type': 'authorization_code',
    }
    
    response = requests.post(token_url, data=data)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error exchanging code for token: {response.text}")
        return None


def refresh_access_token(google_credential):
    """
    Refresh the access token using the refresh token.
    Updates the GoogleCredential model in-place.
    """
    token_url = 'https://oauth2.googleapis.com/token'
    
    data = {
        'client_id': settings.GOOGLE_OAUTH2_CLIENT_ID,
        'client_secret': settings.GOOGLE_OAUTH2_CLIENT_SECRET,
        'refresh_token': google_credential.refresh_token,
        'grant_type': 'refresh_token',
    }
    
    response = requests.post(token_url, data=data)
    
    if response.status_code == 200:
        token_data = response.json()
        
        from django.utils import timezone
        from datetime import timedelta
        
        # Calculate new expiry time
        expires_in = token_data.get('expires_in', 3600)
        new_expiry = timezone.now() + timedelta(seconds=expires_in)
        
        # Update credential
        google_credential.access_token = token_data['access_token']
        google_credential.token_expiry = new_expiry
        google_credential.save()
        
        return True
    else:
        print(f"Error refreshing token: {response.text}")
        return False


def fetch_photos(google_credential, max_results=100):
    """
    Fetch photos from Google Photos API.
    """
    photos_url = 'https://photoslibrary.googleapis.com/v1/mediaItems'
    
    headers = {
        'Authorization': f'Bearer {google_credential.access_token}',
        'Content-Type': 'application/json',
    }
    
    params = {
        'pageSize': max_results,
    }
    
    response = requests.get(photos_url, headers=headers, params=params)
    
    if response.status_code == 200:
        data = response.json()
        return data.get('mediaItems', [])
    else:
        print(f"Error fetching photos: {response.text}")
        return []


def download_photo(photo_url, access_token):
    """
    Download a photo from Google Photos.
    """
    headers = {
        'Authorization': f'Bearer {access_token}',
    }
    
    response = requests.get(photo_url, headers=headers)
    
    if response.status_code == 200:
        return response.content
    else:
        print(f"Error downloading photo: {response.text}")
        return None
