
from rest_framework import serializers
from .models import Photo, Face, PhotoFace


class FaceSerializer(serializers.ModelSerializer):
    photos_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Face
        fields = ['id', 'name', 'thumbnail', 'created_at', 'photos_count']
        read_only_fields = ['created_at', 'photos_count']
    
    def get_photos_count(self, obj):
        return obj.photo_faces.count()


class PhotoFaceSerializer(serializers.ModelSerializer):
    face = FaceSerializer(read_only=True)
    
    class Meta:
        model = PhotoFace
        fields = ['id', 'face', 'confidence']


class PhotoSerializer(serializers.ModelSerializer):
    faces = serializers.SerializerMethodField()
    
    class Meta:
        model = Photo
        fields = ['id', 'google_photo_id', 'url', 'thumbnail_url', 'date_taken', 'created_at', 'faces']
        read_only_fields = ['id', 'google_photo_id', 'created_at']
    
    def get_faces(self, obj):
        photo_faces = PhotoFace.objects.filter(photo=obj)
        return PhotoFaceSerializer(photo_faces, many=True).data
