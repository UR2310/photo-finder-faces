
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Photo, Face, PhotoFace, GoogleCredential
from .serializers import PhotoSerializer, FaceSerializer, PhotoFaceSerializer
from .tasks import process_photos_task


class PhotoListAPIView(generics.ListAPIView):
    serializer_class = PhotoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Photo.objects.filter(user=self.request.user)


class PhotoDetailAPIView(generics.RetrieveAPIView):
    serializer_class = PhotoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Photo.objects.filter(user=self.request.user)


class FaceListAPIView(generics.ListCreateAPIView):
    serializer_class = FaceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Face.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FaceDetailAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = FaceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Face.objects.filter(user=self.request.user)


class FilteredPhotoListAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        """
        Filter photos based on face IDs provided in query parameters.
        """
        face_ids = request.query_params.getlist('face_id', [])
        
        if not face_ids:
            # Return all photos if no face IDs provided
            photos = Photo.objects.filter(user=request.user)
        else:
            # Filter photos containing all specified faces
            photos = Photo.objects.filter(user=request.user)
            for face_id in face_ids:
                photos = photos.filter(photo_faces__face_id=face_id)
        
        serializer = PhotoSerializer(photos, many=True)
        return Response(serializer.data)


class ProcessPhotosAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, format=None):
        """
        Trigger background task to process user's Google Photos.
        """
        try:
            google_credential = request.user.google_credential
            if not google_credential:
                return Response(
                    {"error": "Google Photos not connected. Please connect first."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Enqueue background task
            process_photos_task.delay(user_id=request.user.id)
            
            return Response(
                {"message": "Photo processing started. You will be notified when complete."},
                status=status.HTTP_202_ACCEPTED
            )
        except GoogleCredential.DoesNotExist:
            return Response(
                {"error": "Google Photos not connected. Please connect first."},
                status=status.HTTP_400_BAD_REQUEST
            )
