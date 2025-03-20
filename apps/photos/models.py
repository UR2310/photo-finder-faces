
from django.db import models
from django.conf import settings


class Photo(models.Model):
    """
    Model representing a photo from Google Photos.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='photos')
    google_photo_id = models.CharField(max_length=255, unique=True)
    url = models.URLField(max_length=500)
    thumbnail_url = models.URLField(max_length=500)
    date_taken = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date_taken']

    def __str__(self):
        return f"Photo {self.google_photo_id}"


class Face(models.Model):
    """
    Model representing a face detected in a photo.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='faces')
    name = models.CharField(max_length=255, blank=True, null=True)
    thumbnail = models.ImageField(upload_to='faces/%Y/%m/%d/', blank=True, null=True)
    face_encoding = models.BinaryField(null=True, blank=True)  # Stores face recognition data
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name or f"Unnamed Face {self.id}"


class PhotoFace(models.Model):
    """
    Model representing the relationship between a photo and a face.
    """
    photo = models.ForeignKey(Photo, on_delete=models.CASCADE, related_name='photo_faces')
    face = models.ForeignKey(Face, on_delete=models.CASCADE, related_name='photo_faces')
    confidence = models.FloatField(default=0.0)  # Confidence score of face detection
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('photo', 'face')

    def __str__(self):
        return f"{self.photo} - {self.face}"


class GoogleCredential(models.Model):
    """
    Model for storing Google OAuth credentials.
    """
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='google_credential')
    access_token = models.TextField()
    refresh_token = models.TextField()
    token_expiry = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Google credentials for {self.user.username}"

    def is_expired(self):
        from django.utils import timezone
        return self.token_expiry <= timezone.now()
