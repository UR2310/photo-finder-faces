
from django.contrib import admin
from .models import Photo, Face, PhotoFace, GoogleCredential


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'google_photo_id', 'date_taken', 'created_at')
    search_fields = ('google_photo_id',)
    list_filter = ('created_at', 'date_taken')


@admin.register(Face)
class FaceAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'name', 'created_at')
    search_fields = ('name',)
    list_filter = ('created_at',)


@admin.register(PhotoFace)
class PhotoFaceAdmin(admin.ModelAdmin):
    list_display = ('id', 'photo', 'face', 'confidence', 'created_at')
    list_filter = ('created_at',)


@admin.register(GoogleCredential)
class GoogleCredentialAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'token_expiry', 'created_at')
    list_filter = ('created_at', 'token_expiry')
